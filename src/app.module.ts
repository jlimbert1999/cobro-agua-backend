import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ConsumerModule } from './consumer/consumer.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.configuration';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    AuthModule,
    ConsumerModule,
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://127.0.0.1/water-charges'),
  ],
})
export class AppModule {}
