import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from 'src/users/schemas/user.schema';
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
    if (!userDB) throw new BadRequestException('Usuario o Contraseña incorrectos');
    if (!bcrypt.compareSync(password, userDB.password)) {
      throw new BadRequestException('Usuario o Contraseña incorrectos');
    }
    return {
      token: this._generateToken(userDB),
      redirectTo: this._getRoute(userDB.roles),
    };
  }

  async checkAuthStatus(id_user: number) {
    const userDB = await this.userModel.findById(id_user);
    if (!userDB) throw new UnauthorizedException();
    return { token: this._generateToken(userDB), menu: this._getMenu(userDB.roles) };
  }

  private _generateToken(user: User): string {
    const payload: JwtPayload = {
      id_user: user.id,
      fullname: user.fullname,
    };
    return this.jwtService.sign(payload);
  }

  private _getRoute(roles: UserRole[]): string {
    if (roles.includes(UserRole.ADMIN)) return 'home/users';
    if (roles.includes(UserRole.OFFICER)) return 'home/customers';
    return '';
  }

  private _getMenu(roles: UserRole[]) {
    const menu: { label: string; icon: string; routerLink?: string; items?: any }[] = [];
    if (roles.includes(UserRole.ADMIN)) {
      menu.push(
        {
          label: 'Usuarios',
          icon: 'pi pi-fw pi-user',
          routerLink: 'users',
        },
        {
          label: 'Configuracion',
          icon: 'pi pi-fw pi-cog',
          routerLink: 'settings',
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
          ],
        },
      );
    }
    return menu;
  }
}
