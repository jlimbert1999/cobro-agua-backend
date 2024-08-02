import { Injectable } from '@nestjs/common';
@Injectable()
export class ConsumerService {
  constructor(
    // @InjectModel(Customer.name) private clientModel: Model<Customer>,
    // @InjectModel(MeterReading.name) private readingModel: Model<MeterReading>,
  ) {}

  async getClients() {
    // return await this.clientModel
    //   .find({})
    //   .populate('actions')
    //   .sort({ _id: -1 });
  }

  async getLastConsumptionRecord(id_action: string) {
    // return await this.readingModel
    //   .findOne({ action: id_action })
    //   .sort({ consumptionDate: -1 });
  }
  async getActionDebts(id_action: string) {
    // return await this.readingModel.find({ action: id_action, isPaid: false });
  }
  async payDebts(readingsIds: string[]) {
    // await this.readingModel.updateMany(
    //   { _id: { $in: readingsIds } },
    //   { isPaid: true },
    // );
    return { message: 'Pagos realizados.' };
  }
}
