import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll(limit: number, offset: number) {
    const [clients, length] = await Promise.all([
      this.clientModel.find().skip(offset).limit(limit).sort({ _id: -1 }),
      this.clientModel.countDocuments(),
    ]);
    return { clients, length };
  }

  async create(client: CreateClientDto) {
    const duplicate = await this.clientModel.findOne({ dni: client.dni });
    if (duplicate) {
      throw new BadRequestException(`El DNI: ${client.dni} ya existe.`);
    }
    const model = new this.clientModel(client);
    return await model.save();
  }

  async update(id: string, clientDto: UpdateClientDto) {
    const clientDB = await this.clientModel.findById(id);
    if (!clientDB) throw new NotFoundException(`El cliente editado no existe`);
    if (clientDB.dni !== clientDto.dni) {
      const duplicate = await this.clientModel.findOne({ dni: clientDto.dni });
      if (duplicate) {
        throw new BadRequestException(`El DNI: ${clientDto.dni} ya existe.`);
      }
    }
    return await this.clientModel.findByIdAndUpdate(id, clientDto, {
      new: true,
    });
  }
}
