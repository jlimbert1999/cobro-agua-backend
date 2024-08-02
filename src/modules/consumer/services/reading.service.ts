import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';

import { PaginationParamsDto } from 'src/common/dtos';
import { Customer, MeterReading } from '../entities';
import { InvoiceService } from './invoice.service';
import { CreateReadingDto } from '../dtos';

@Injectable()
export class ReadingService {
  constructor(
    @InjectRepository(MeterReading) private meterReadingRepository: Repository<MeterReading>,
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    private invoiceService: InvoiceService,
    private dataSource: DataSource,
  ) {}

  async create({ customerId, reading }: CreateReadingDto, date = new Date()) {
    date.setMonth(date.getMonth() - 1);
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
      relations: { type: { preferences: true } },
    });
    if (!customer) throw new BadRequestException(`Customer with ${customerId} dont exist`);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      await this._checkDuplicate(customer.id, queryRunner);
      const consumption = await this._calculateConsumption(customerId, reading, queryRunner);
      const createdMeterReading = queryRunner.manager.create(MeterReading, {
        consumption: consumption,
        customer: customer,
        reading: reading,
        createdAt: date,
      });
      await queryRunner.manager.save(createdMeterReading);
      await this.invoiceService.generateConsumptionInvoice({
        queryRunner: queryRunner,
        service: createdMeterReading,
        customer: customer,
        consumption: consumption,
      });
      await queryRunner.commitTransaction();
      return { message: 'Lectura registrada' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error create reading');
    } finally {
      await queryRunner.release();
    }
  }

  async getLastReading(customerId: string): Promise<MeterReading | undefined> {
    return await this.meterReadingRepository.findOne({
      where: { customerId: customerId },
      order: { createdAt: 'DESC' },
    });
  }

  async getReadingsByClient(customerId: string, { limit, offset }: PaginationParamsDto) {
    const [readings, length] = await this.meterReadingRepository.findAndCount({
      where: { customerId: customerId },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });
    return { readings, length };
  }

  private async _checkDuplicate(customerId: string, queryRunner: QueryRunner): Promise<void> {
    const previusMonth = new Date().getMonth();
    const year = new Date().getFullYear();
    const duplicate = await queryRunner.manager
      .createQueryBuilder(MeterReading, 'reading')
      .where('reading.customerId = :id', { id: customerId })
      .andWhere('EXTRACT(month FROM reading.createdAt) = :previusMonth', { previusMonth })
      .andWhere('EXTRACT(year FROM reading.createdAt) = :year', { year })
      .leftJoinAndSelect('reading.invoice', 'invoice')
      .leftJoinAndSelect('invoice.payment', 'payment')
      .getOne();
    if (!duplicate) return;
    if (duplicate.invoice.payment) {
      throw new BadRequestException('La lectura ya ha sido pagada. No se puede remplazar');
    }
    await queryRunner.manager.delete(MeterReading, { id: duplicate.id });
  }

  private async _calculateConsumption(customerId: string, currentReading: number, queryRunner: QueryRunner) {
    const lastRecord = await queryRunner.manager.findOne(MeterReading, {
      where: { customerId: customerId },
      order: { createdAt: 'DESC' },
    });
    const consumption = lastRecord ? currentReading - lastRecord.reading : 0;
    if (consumption < 0) {
      throw new BadRequestException(`Lectura invalida. Actual: ${currentReading} < Anterior: ${lastRecord?.reading}`);
    }
    return consumption;
  }
}
