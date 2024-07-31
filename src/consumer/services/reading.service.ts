import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReadingDto } from '../dtos';
import { InvoiceService } from './invoice.service';
import { PaginationParamsDto } from 'src/common/dtos';
import { Customer, Invoice, MeterReading } from '../entities';
import { Between, DataSource, IsNull, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface uploaddata {
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  phone: string;
  address: string;
}
@Injectable()
export class ReadingService {
  constructor(
    @InjectRepository(MeterReading) private meterReadingRepository: Repository<MeterReading>,
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    private invoiceService: InvoiceService,
    private dataSource: DataSource,
  ) {
    // @InjectConnection() private connection: Connection,
    // @InjectModel(MeterReading.name) private readingModel: Model<MeterReading>,
    // @InjectModel(Customer.name) private customerModel: Model<Customer>,
    // private invoiceService: InvoiceService,
  }

  async create({ customerId, reading }: CreateReadingDto) {
    // const { client, reading } = readingDto;
    // const startOfMonth = new Date();
    // startOfMonth.setDate(1);
    // startOfMonth.setHours(0, 0, 0, 0);

    // const endOfMonth = new Date(startOfMonth);
    // endOfMonth.setMonth(startOfMonth.getMonth() + 1);
    // endOfMonth.setDate(0);
    // endOfMonth.setHours(23, 59, 59, 999);
    // const current = await this.meterReadingRepository.findOne({
    //   where: { createdAt: Between(startOfMonth, endOfMonth) },
    //   relations: { invoice: true },
    // });
    // if (current.invoice.payment) {
    //   throw new BadRequestException('La solicitud ya ha sido cancelada');
    // }
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
      relations: { type: { preferences: true } },
    });
    if (!customer) throw new BadRequestException(`Customer with ${customerId} dont exist`);
    const consumption = await this._calculateConsumption(customerId, reading);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const createdMeterReading = queryRunner.manager.create(MeterReading, {
        customer: customer,
        reading: reading,
        consumption: consumption,
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
      if (error instanceof HttpException) {
        throw error;
      }
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

  async getReadingsByClient(id_client: string, { limit, offset }: PaginationParamsDto) {
    // const [readings, length] = await Promise.all([
    //   this.readingModel.find({ client: id_client }).sort({ reading_date: -1 }).limit(limit).skip(offset),
    //   this.readingModel.countDocuments({ client: id_client }),
    // ]);
    // return { readings, length };
  }

 

  private async _checkDuplicate(date: Date, id_client: string) {
    // const duplicate = await this.readingModel.findOne(query);
    // if (duplicate) throw new BadRequestException('Ya existe una lectura para la fecha proporcionada');
  }

  private async _calculateConsumption(customerId: string, reading: number) {
    const lastReading = await this.getLastReading(customerId);
    const consumption = reading - (lastReading ? lastReading.reading : 0);
    if (consumption < 0) throw new BadRequestException('Invalid reading. current < last');
    return consumption;
  }
}
