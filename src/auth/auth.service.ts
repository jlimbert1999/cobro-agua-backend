import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schemas/user.schema';
import { AuthDto } from './dto/auth.dto';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login({ login, password }: AuthDto) {
    const userDB = await this.userModel.findOne({ login });
    if (!userDB)
      throw new BadRequestException('Usuario o Contraseña incorrectos');
    if (!bcrypt.compareSync(password, userDB.password)) {
      throw new BadRequestException('Usuario o Contraseña incorrectos');
    }
    return {
      token: this._generateToken(userDB),
    };
  }

  async checkAuthStatus(id_user: number) {
    const userDB = await this.userModel.findById(id_user);
    if (!userDB) throw new UnauthorizedException();
    return { token: this._generateToken(userDB) };
  }

  private _generateToken(user: User): string {
    const payload: JwtPayload = {
      id_user: user.id,
      fullname: user.fullname,
    };
    return this.jwtService.sign(payload);
  }
}
