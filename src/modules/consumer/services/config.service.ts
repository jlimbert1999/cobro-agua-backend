import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigDto } from '../dtos';

@Injectable()
export class ConfigService {
  constructor() {}

  async create(configDto: ConfigDto) {
    // const configDB = await this.configModel.findOne({});
    // if (configDB) {
    //   await this.configModel.deleteOne({ _id: configDB._id });
    // }
    // const newConfig = new this.configModel(configDto);
    // return await newConfig.save();
  }

  async getSettings(): Promise<any> {
    // const configDB = await this.configModel.findOne({});
    // if (!configDB) throw new BadRequestException('Sin parametros configurados');
    // return configDB;
  }
}
