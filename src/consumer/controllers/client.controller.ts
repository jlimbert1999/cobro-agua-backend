import {
  Controller,
  Post,
  Body,
  Patch,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ClientService } from '../services';
import { CreateClientDto, UpdateClientDto } from '../dto';
import { PaginationParamsDto } from 'src/common/dtos';

@Controller('clients')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get()
  findAll(@Query() params: PaginationParamsDto) {
    return this.clientService.findAll(params.limit, params.offset);
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
