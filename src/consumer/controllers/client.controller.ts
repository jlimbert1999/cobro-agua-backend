import { Controller, Post, Body, Patch, Get, Param } from '@nestjs/common';
import { ClientService } from '../services';
import { CreateClientDto, UpdateClientDto } from '../dto';

@Controller('clients')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Post()
  create(@Body() client: CreateClientDto) {
    return this.clientService.create(client);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() client: UpdateClientDto) {
    return this.clientService.update(id, client);
  }
}
