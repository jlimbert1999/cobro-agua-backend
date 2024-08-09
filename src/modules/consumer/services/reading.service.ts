import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, QueryRunner, Repository } from 'typeorm';

import { PaginationParamsDto } from 'src/common/dtos';
import { Customer, MeterReading } from '../entities';
import { InvoiceService } from './invoice.service';
import { CreateReadingDto } from '../dtos';

interface consumptionProps {
  customerId: string;
  reading: number;
  date: Date;
  queryRunner: QueryRunner;
}
@Injectable()
export class ReadingService {
  constructor(
    @InjectRepository(MeterReading) private meterReadingRepository: Repository<MeterReading>,
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    private invoiceService: InvoiceService,
    private dataSource: DataSource,
  ) {}

  // ! delete after upload data
  async createReadingWithoutInvoice(reading: number, customer: Customer, year: number, month: number) {
    const createdMeterReading = this.meterReadingRepository.create({
      consumption: 0,
      customer: customer,
      reading: reading,
      year: year,
      month: month - 1,
    });
    await this.meterReadingRepository.save(createdMeterReading);
  }

  async create({ customerId, reading }: CreateReadingDto, date = new Date()) {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
      relations: { type: { preferences: true } },
    });
    if (!customer) throw new BadRequestException(`Customer with ${customerId} dont exist`);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      await this._checkDuplicate(customer.id, date, queryRunner);
      const consumption = await this._calculateConsumption({
        queryRunner: queryRunner,
        customerId: customer.id,
        date: date,
        reading,
      });
      const createdMeterReading = queryRunner.manager.create(MeterReading, {
        consumption: consumption,
        customer: customer,
        reading: reading,
        year: date.getFullYear(),
        month: date.getMonth() - 1,
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
      console.log(error);
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error create reading');
    } finally {
      await queryRunner.release();
    }
  }

  async getLastReading(customerId: string): Promise<MeterReading | undefined> {
    const date = new Date();
    const last = await this.meterReadingRepository.findOne({
      where: { customerId, year: date.getFullYear(), month: LessThan(date.getMonth() - 1) },
      order: { year: 'DESC', month: 'DESC' },
    });
    return last;
  }

  async getReadingsByClient(customerId: string, { limit, offset }: PaginationParamsDto) {
    const [readings, length] = await this.meterReadingRepository.findAndCount({
      where: { customerId: customerId },
      skip: offset,
      take: limit,
      order: {
        year: 'DESC',
        month: 'DESC',
      },
    });
    return { readings, length };
  }

  private async _checkDuplicate(customerId: string, date: Date, queryRunner: QueryRunner): Promise<void> {
    const duplicate = await queryRunner.manager.findOne(MeterReading, {
      where: { customerId: customerId, year: date.getFullYear(), month: date.getMonth() - 1 },
      relations: { invoice: true },
    });
    if (!duplicate) return;
    if (duplicate.invoice.paymentId) {
      throw new BadRequestException('La lectura ya ha sido pagada. No se puede remplazar');
    }
    await queryRunner.manager.delete(MeterReading, { id: duplicate.id });
  }

  private async _calculateConsumption({ reading, customerId, date, queryRunner }: consumptionProps) {
    const lastRecord = await queryRunner.manager.findOne(MeterReading, {
      where: { customerId, year: date.getFullYear(), month: LessThan(date.getMonth() - 1) },
      order: { year: 'DESC', month: 'DESC' },
    });
    const consumption = lastRecord ? reading - lastRecord.reading : 0;
    if (consumption < 0) {
      throw new BadRequestException(`Lectura invalida. Actual: ${reading} < Anterior: ${lastRecord?.reading}`);
    }
    return consumption;
  }
}
