import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Config } from '../schemas';
import { ConfigDto } from '../dto';

@Injectable()
export class ConfigService {
  constructor(@InjectModel(Config.name) private configModel: Model<Config>) {}

  async create(configDto: ConfigDto) {
    const configDB = await this.configModel.findOne({});
    if (configDB) {
      await this.configModel.deleteOne({ _id: configDB._id });
    }
    const newConfig = new this.configModel(configDto);
    return await newConfig.save();
  }

  async getSettings(): Promise<Config> {
    const configDB = await this.configModel.findOne({});
    if (!configDB) throw new BadRequestException('Sin parametros configurados');
    return configDB;
  }
}
