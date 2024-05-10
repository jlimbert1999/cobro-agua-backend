import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Client, Reading } from '../schemas';
import { Model } from 'mongoose';
import { CreateReadingDto } from '../dto';
import { ConfigService } from './config.service';

@Injectable()
export class ReadingService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Reading.name) private readingModel: Model<Reading>,
    private configService: ConfigService,
  ) {}

  async create(reading: CreateReadingDto): Promise<{ message: string }> {
    const consumptionDate = new Date(reading.consumptionDate);
    const year = consumptionDate.getFullYear();
    const month = consumptionDate.getMonth();
    const payment = await this._calculatePayment(reading.consume);
    const lastRecord = await this.readingModel.findOne({
      consumptionDate: {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1),
      },
    });
    if (lastRecord) {
      await this.readingModel.updateOne(
        { _id: lastRecord._id },
        { consume: reading.consume, amountToPay: payment },
      );
      return { message: 'Lectura actualizada.' };
    }
    const createdReading = new this.readingModel({
      ...reading,
      amountToPay: payment,
    });
    await createdReading.save();
    return { message: 'Lectura creada.' };
  }

  async getLastConsumptionRecord(id_client: string) {
    return await this.readingModel
      .findOne({ client: id_client })
      .sort({ consumptionDate: -1 });
  }
  async getDebts(id_client: string) {
    return await this.readingModel
      .find({ client: id_client, isPaid: false })
      .sort({ consumptionDate: -1 });
  }

  private async _calculatePayment(consume: number): Promise<number> {
    const { maxUnits, basePrice, pricePerExcessUnit } =
      await this.configService.getSettings();
    if (consume < maxUnits) return basePrice;
    const additionalPayent = (consume - maxUnits) * pricePerExcessUnit;
    return basePrice + additionalPayent;
  }
}
