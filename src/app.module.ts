import { ReportsModule } from './modules/reports/reports.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { join } from 'path';

import { ConsumerModule } from './modules/consumer/consumer.module';
import configuration from './config/env.configuration';
import { UserModule } from './modules/users/user.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdministrationModule } from './modules/administration/administration.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        database: configService.get('DATABASE_NAME'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    AdministrationModule,
    ConsumerModule,
    PaymentModule,
    ReportsModule,
  ],
})
export class AppModule {}
