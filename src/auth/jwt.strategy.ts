import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { JwtPayload } from './interfaces/jwt.interface';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('jwt_key'),
    });
  }
  async validate(payload: JwtPayload): Promise<any> {
    const { id_user } = payload;
    const userDB = await this.userRepository.findOne({ where: { id: id_user } });
    if (!userDB) throw new UnauthorizedException('Token invalido, vuelva a iniciar sesion');
    delete userDB.password;
    return userDB;
  }
}
