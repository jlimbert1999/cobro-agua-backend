import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { ActionService } from '../services';
import { CreateActionDto, UpdateActionDto } from '../dto';

@Controller('actions')
export class ActionController {
  constructor(private actionService: ActionService) {}

  @Get()
  findAll() {
    return this.actionService.findAll();
  }

  @Post()
  creata(@Body() action: CreateActionDto) {
    return this.actionService.create(action);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() action: UpdateActionDto) {
    return this.actionService.update(id, action);
  }

  @Get('availables/:text')
  searchAvailables(@Param('text') text: string) {
    return this.actionService.searchAvailableActions(text);
  }
}
