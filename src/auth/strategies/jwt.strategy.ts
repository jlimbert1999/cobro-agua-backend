import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces';
import { User } from '../schemas/user.schema';
import { EnvConfig } from 'src/config/env.configuration';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService<EnvConfig>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('jwt_key'),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { id_account } = payload;
    const account = await this.userModel
      .findById(id_account)
      .select('-password');
    if (!account)
      throw new UnauthorizedException(
        'Token invalido, vuelva a iniciar sesion',
      );
    if (account.role.length === 0)
      throw new UnauthorizedException(
        'Esta cuenta no tiene ningun permiso asignado',
      );
    return account;
  }
}
