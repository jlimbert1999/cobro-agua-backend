import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Action } from '../schemas';
import { CreateActionDto } from '../dto';
import { UpdateActionDto } from '../dto/action-update.dto';

@Injectable()
export class ActionService {
  constructor(@InjectModel(Action.name) private actionModel: Model<Action>) {}

  async findAll() {
    return this.actionModel.find({});
  }

  async create(action: CreateActionDto) {
    const createdAction = new this.actionModel(action);
    return await createdAction.save();
  }

  async update(id: string, action: UpdateActionDto) {
    try {
      return await this.actionModel.findByIdAndUpdate(id, action, {
        new: true,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error create action');
    }
  }

  public async createActions(
    actions: CreateActionDto[],
    session: mongoose.mongo.ClientSession,
  ): Promise<Action[]> {
    const model: Action[] = actions.map(
      (action) => new this.actionModel(action),
    );
    return await this.actionModel.insertMany(model, { session });
  }

  async searchAvailableActions(text: string) {
    const regexp = new RegExp(text, 'i');
    return await this.actionModel
      .aggregate()
      .match({ address: regexp })
      .lookup({
        from: 'clients',
        localField: '_id',
        foreignField: 'actions',
        as: 'client',
      })
      .match({ client: { $size: 0 } });
  }
}
