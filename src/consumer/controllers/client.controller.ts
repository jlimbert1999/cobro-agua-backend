import { Controller, Post, Body, Patch, Get } from '@nestjs/common';
import { ClientService } from '../services';
import { CreateClientDto } from '../dto';

@Controller('clients')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Post()
  create(@Body() action: CreateClientDto) {
    return this.clientService.create(action);
  }

  @Patch()
  update(@Body() action: CreateClientDto) {
    return this.clientService.create(action);
  }
}
