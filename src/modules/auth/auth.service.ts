import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { JwtPayload } from './interfaces/jwt.interface';
import { AuthDto } from './dto/auth.dto';
import { User, UserRole } from 'src/modules/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login({ login, password }: AuthDto) {
    const userDB = await this.userRepository.findOneBy({ login });
    if (!userDB) throw new BadRequestException('Usuario o Contraseña incorrectos');
    if (!bcrypt.compareSync(password, userDB.password)) {
      throw new BadRequestException('Usuario o Contraseña incorrectos');
    }
    return {
      token: this._generateToken(userDB),
      redirectTo: this._getRoute(userDB.roles),
      menu: this._getMenu(userDB.roles),
    };
  }

  async checkAuthStatus(userId: number) {
    const userDB = await this.userRepository.findOneBy({ id: userId });
    if (!userDB) throw new UnauthorizedException();
    return {
      token: this._generateToken(userDB),
      redirectTo: this._getRoute(userDB.roles),
      menu: this._getMenu(userDB.roles),
      roles: userDB.roles,
    };
  }

  private _generateToken(user: User): string {
    const payload: JwtPayload = {
      id_user: user.id,
      fullname: user.fullname,
    };
    return this.jwtService.sign(payload);
  }

  private _getRoute(roles: UserRole[]): string {
    if (roles.includes(UserRole.ADMIN)) return 'home/administration/users';
    if (roles.includes(UserRole.OFFICER)) return 'home/customers';
    if (roles.includes(UserRole.READER)) return 'home/reading';
    return '';
  }

  private _getMenu(roles: UserRole[]) {
    const menu: { label: string; icon: string; routerLink?: string; items?: any }[] = [];
    if (roles.includes(UserRole.ADMIN)) {
      menu.push(
        {
          label: 'Usuarios',
          icon: 'pi pi-fw pi-user',
          routerLink: 'administration/users',
        },
        {
          label: 'Grupos',
          icon: 'pi pi-fw pi-cog',
          routerLink: 'administration/customer-types',
        },
        {
          label: 'Descuentos',
          icon: 'pi pi-fw pi-angle-double-down',
          routerLink: 'administration/discounts',
        },
      );
    }
    if (roles.includes(UserRole.OFFICER)) {
      menu.push(
        {
          label: 'Afiliados',
          icon: 'pi pi-fw pi-id-card',
          routerLink: 'customers',
        },
        {
          label: 'Reportes',
          icon: 'pi pi-fw pi-search',
          items: [
            {
              label: 'Estado de cuenta',
              routerLink: 'reports/customer-status',
            },
            {
              label: 'Pagos realizados',
              routerLink: 'reports/payments-rage',
            },
          ],
        },
      );
    }
    if (roles.includes(UserRole.READER)) {
      menu.push({
        label: 'Lecturas',
        icon: 'pi pi-align-justify',
        routerLink: 'reading',
      });
    }
    return menu;
  }
}
