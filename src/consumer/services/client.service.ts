import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Client } from '../schemas';
import { CreateClientDto, UpdateClientDto } from '../dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectConnection() private connection: Connection,
  ) {}

  async findAll() {
    return await this.clientModel.find({});
  }

  async create(client: CreateClientDto) {
    const clientDB = await this.clientModel.findOne({ dni: client.dni });
    if (clientDB) {
      throw new BadRequestException(`El DNI: ${client.dni} ya existe.`);
    }
    const model = new this.clientModel(client);
    return await model.save();
  }

  async update(id: string, client: UpdateClientDto) {
    const clientDB = await this.clientModel.findOne({ dni: client.dni });
    if (clientDB) {
      throw new BadRequestException(`El DNI: ${client.dni} ya existe.`);
    }
    return await this.clientModel.findByIdAndUpdate(id, client);
  }
}
