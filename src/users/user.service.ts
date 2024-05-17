import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { PaginationParamsDto } from 'src/common/dtos';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll({ limit, offset }: PaginationParamsDto) {
    const [users, length] = await Promise.all([
      this.userModel.find({}).skip(offset).limit(limit).sort({ _id: -1 }),
      this.userModel.countDocuments(),
    ]);
    return { users, length };
  }

  async create({ password, ...props }: CreateUserDto) {
    await this._checkDuplicateLogin(props.login);
    const encryptedPassword = this._encryptPassword(password);
    const newUser = new this.userModel({
      ...props,
      password: encryptedPassword,
    });
    const createdUser = await newUser.save();
    return this._removePasswordField(createdUser);
  }

  async update(id: string, userDto: UpdateUserDto) {
    const userDB = await this.userModel.findById(id);
    if (!userDB) throw new NotFoundException(`El usuario editado no existe`);
    if (userDto.login !== userDB.login) {
      await this._checkDuplicateLogin(userDto.login);
    }
    if (userDto.password) {
      userDto['password'] = this._encryptPassword(userDto.password);
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(id, userDto);
    return this._removePasswordField(updatedUser);
  }

  private _encryptPassword(password: string): string {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  }

  private async _checkDuplicateLogin(login: string) {
    const duplicate = await this.userModel.findOne({ login });
    if (duplicate) throw new BadRequestException(`El login ${login} ya existe`);
  }

  private _removePasswordField(user: User) {
    const result = { ...user.toObject() };
    delete result.password;
    return result;
  }
}
