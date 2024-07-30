import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConfigDto } from '../dtos';
import { ConfigService } from '../services';

@Controller('config')
export class ConfigController {
  constructor(private configService: ConfigService) {}
  @Get()
  getSettings() {
    return this.configService.getSettings();
  }

  @Post()
  create(@Body() config: ConfigDto) {
    return this.configService.create(config);
  }
}
