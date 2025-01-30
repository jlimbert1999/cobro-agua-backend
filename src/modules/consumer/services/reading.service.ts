import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, QueryRunner, Repository } from 'typeorm';

import { PaginationParamsDto } from 'src/common/dtos';
import { Customer, MeterReading } from '../entities';
import { InvoiceService } from './invoice.service';
import { CreateReadingDto } from '../dtos';

interface filterReadingProps {
  customerId: number;
  adjustedYear: number;
  adjustedMonth: number;
  queryRunner: QueryRunner;
}
interface consumptionProps extends filterReadingProps {
  reading: number;
}
@Injectable()
export class ReadingService {
  constructor(
    @InjectRepository(MeterReading) private meterReadingRepository: Repository<MeterReading>,
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    private invoiceService: InvoiceService,
    private dataSource: DataSource,
  ) {}

  async create({ customerId, reading, isNew }: CreateReadingDto, date = new Date()) {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
      relations: { type: { preferences: true }, discount: true },
    });
    if (!customer) throw new BadRequestException(`Customer with ${customerId} dont exist`);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const { adjustedYear, adjustedMonth } = this.adjustDate(date);
      await this._removeDuplicateReading({ customerId: customer.id, adjustedMonth, adjustedYear, queryRunner });
      const consumption = isNew
        ? 0
        : await this._calculateConsumption({
            customerId: customer.id,
            adjustedYear,
            adjustedMonth,
            reading,
            queryRunner,
          });

      const createdMeterReading = queryRunner.manager.create(MeterReading, {
        consumption: consumption,
        customer: customer,
        reading: reading,
        month: adjustedMonth,
        year: adjustedYear,
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

  async getPreviusReading(customerId: number): Promise<MeterReading | undefined> {
    const { adjustedMonth, adjustedYear } = this.adjustDate(new Date());
    const filterYear = adjustedMonth === 0 ? adjustedYear - 1 : adjustedYear;
    const filterMonth = adjustedMonth === 0 ? 12 : adjustedMonth;
    const last = await this.meterReadingRepository.findOne({
      where: { customerId, year: filterYear, month: LessThan(filterMonth) },
      order: { year: 'DESC', month: 'DESC' },
    });
    return last;
  }

  async getCurrentReading(customerId: number): Promise<MeterReading | undefined> {
    const { adjustedMonth, adjustedYear } = this.adjustDate(new Date());
    const current = await this.meterReadingRepository.findOne({
      where: { customerId, year: adjustedYear, month: adjustedMonth },
      order: { year: 'DESC', month: 'DESC' },
    });
    return current;
  }

  async getReadingsByClient(customerId: number, { limit, offset }: PaginationParamsDto) {
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

  private async _removeDuplicateReading({
    customerId,
    adjustedYear,
    adjustedMonth,
    queryRunner,
  }: filterReadingProps): Promise<void> {
    const duplicate = await queryRunner.manager.findOne(MeterReading, {
      where: { customerId: customerId, year: adjustedYear, month: adjustedMonth },
      relations: { invoice: true },
    });
    if (!duplicate) return;
    if (duplicate.invoice.paymentId) {
      throw new BadRequestException('La lectura ya ha sido pagada. No se puede remplazar');
    }
    await queryRunner.manager.delete(MeterReading, { id: duplicate.id });
  }

  private async _calculateConsumption({
    reading,
    customerId,
    queryRunner,
    adjustedYear,
    adjustedMonth,
  }: consumptionProps) {
    const filterYear = adjustedMonth === 0 ? adjustedYear - 1 : adjustedYear;
    const filterMonth = adjustedMonth === 0 ? 12 : adjustedMonth;
    const lastRecord = await queryRunner.manager.findOne(MeterReading, {
      where: { customerId, year: filterYear, month: LessThan(filterMonth) },
      order: { year: 'DESC', month: 'DESC' },
    });
    const consumption = lastRecord ? reading - lastRecord.reading : reading;
    if (consumption < 0) {
      throw new BadRequestException(`Lectura invalida. Actual: ${reading} < Anterior: ${lastRecord?.reading}`);
    }
    return consumption;
  }

  private adjustDate(date: Date) {
    const month = date.getMonth();
    const adjustedYear = month === 0 ? date.getFullYear() - 1 : date.getFullYear();
    const adjustedMonth = month === 0 ? 11 : month - 1;
    return { adjustedYear, adjustedMonth };
  }
}
