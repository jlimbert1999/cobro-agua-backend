import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Client } from '../schemas';
import { CreateClientDto } from '../dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectConnection() private connection: Connection,
  ) {}

  async findAll() {
    return await this.clientModel.find({}).populate('actions');
  }

  async create(client: CreateClientDto) {
    const clientDB = await this.clientModel.findOne({ dni: client.dni });
    if (clientDB) {
      throw new BadRequestException(`El DNI: ${client.dni} ya existe.`);
    }
    const model = new this.clientModel(client);
    const createdClient = await model.save();
    await createdClient.populate('actions');
    return createdClient;
  }
}
