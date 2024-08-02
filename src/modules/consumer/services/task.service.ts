import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from './config.service';

@Injectable()
export class TaskService {
  constructor(
    // @InjectModel(Customer.name) private clientModel: Model<Customer>,
    // @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    private configService: ConfigService,
  ) {}

  @Cron('0 0 * * *')
  async handleCron() {
    const settings = await this.configService.getSettings();
    // const users = await this.clientModel.find({}).select({ _id: 1 });
    // for (const user of users) {
    //   const totalPendingInvoices = await this.invoiceModel.countDocuments({ client: user._id });
    //   if (totalPendingInvoices >= settings.maxDelayMonths) {
    //     await this.clientModel.updateOne({ _id: user._id }, { status: CustomerStatus.DISABLED });
    //   }
    // }
  }
}
