import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Customer, MeterReading } from '../schemas';
import { Connection, FilterQuery, Model } from 'mongoose';
import { CreateReadingDto } from '../dto';
import { InvoiceService } from './invoice.service';

@Injectable()
export class ReadingService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Customer.name) private clientModel: Model<Customer>,
    @InjectModel(MeterReading.name) private readingModel: Model<MeterReading>,
    private invoiceService: InvoiceService,
  ) {}

  async create(readingDto: CreateReadingDto) {
    const { client, reading } = readingDto;
    const date = new Date();
    await this._checkDuplicate(date);
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const props = await this._calculateConsumption(client, reading);
      const createMeterReading = new this.readingModel({
        reading_date: date,
        client: client,
        previous_reading: props.previous_reading,
        current_reading: props.current_reading,
        consumption: props.consumption,
      });
      await createMeterReading.save({ session });
      await this.invoiceService.generateConsumptionInvoice(client, props.consumption, session);
      await session.commitTransaction();
      return { message: 'Lectura creada' };
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      throw new InternalServerErrorException('Error al registrar el lectura');
    } finally {
      session.endSession();
    }
  }

  async getPreviusReading(id_client: string) {
    return await this.readingModel.findOne({ client: id_client }).sort({ reading_date: -1 });
  }

  async getDebts(id_client: string) {
    return await this.readingModel.findOne({ client: id_client });
  }

  private async _checkDuplicate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const query: FilterQuery<MeterReading> = {
      reading_date: { $gte: new Date(year, month, 1), $lt: new Date(year, month + 1, 1) },
    };
    const duplicate = await this.readingModel.findOne(query);
    if (duplicate) throw new BadRequestException('Ya existe una lectura para la fecha proporcionada');
  }

  private async _calculateConsumption(id_client: string, current_reading: number) {
    const previousRecord = await this.getPreviusReading(id_client);
    const previous_reading = previousRecord ? previousRecord.current_reading : 0;
    const consumption = current_reading - previous_reading;
    if (consumption <= 0) throw new BadRequestException('Registro invalido');
    return { previous_reading, current_reading, consumption };
  }
}
