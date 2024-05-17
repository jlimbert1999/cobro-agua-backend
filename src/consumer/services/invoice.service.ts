import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Invoice } from '../schemas';
import { ConfigService } from './config.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    private configService: ConfigService,
  ) {}

  async generateConsumptionInvoice(id_client: string, consumption: number, session: ClientSession) {
    const amount = await this._calculateConsumptionAmount(consumption);
    const createdInvoice = new this.invoiceModel({ client: id_client, amount });
    return await createdInvoice.save({ session });
  }

  private async _calculateConsumptionAmount(consumption: number): Promise<number> {
    const { maxUnits, basePrice, pricePerExcessUnit } = await this.configService.getSettings();
    if (consumption < maxUnits) return basePrice;
    const additionalPayent = (consumption - maxUnits) * pricePerExcessUnit;
    return basePrice + additionalPayent;
  }
}
