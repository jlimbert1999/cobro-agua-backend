import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, MeterReading } from './schemas';
import { CreateReadingDto } from './dto';

@Injectable()
export class ConsumerService {
  constructor(
    @InjectModel(Customer.name) private clientModel: Model<Customer>,
    @InjectModel(MeterReading.name) private readingModel: Model<MeterReading>,
  ) {}

  async createReading(reading: CreateReadingDto) {
    // const consumptionDate = new Date(reading.reading_date);
    // const year = consumptionDate.getFullYear();
    // const month = consumptionDate.getMonth();
    // const lastRecord = await this.readingModel.findOne({
    //   consumptionDate: {
    //     $gte: new Date(year, month, 1),
    //     $lt: new Date(year, month + 1, 1),
    //   },
    // });
    // if (lastRecord) {
    //   await this.readingModel.updateOne({ _id: lastRecord._id }, reading);
    //   return { message: 'Lectura actualizada.' };
    // }
    // const createdReading = new this.readingModel(reading);
    // await createdReading.save();
    // return { message: 'Lectura creada.' };
  }

  async getClients() {
    return await this.clientModel
      .find({})
      .populate('actions')
      .sort({ _id: -1 });
  }

  async getLastConsumptionRecord(id_action: string) {
    return await this.readingModel
      .findOne({ action: id_action })
      .sort({ consumptionDate: -1 });
  }
  async getActionDebts(id_action: string) {
    return await this.readingModel.find({ action: id_action, isPaid: false });
  }
  async payDebts(readingsIds: string[]) {
    await this.readingModel.updateMany(
      { _id: { $in: readingsIds } },
      { isPaid: true },
    );
    return { message: 'Pagos realizados.' };
  }
}
