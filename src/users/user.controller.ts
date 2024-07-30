import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationParamsDto } from 'src/common/dtos';
import { CreateUserDto, UpdateUserDto } from './dtos';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll(@Query() params: PaginationParamsDto) {
    return this.userService.findAll(params);
  }

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() userDto: UpdateUserDto) {
    return this.userService.update(+id, userDto);
  }
}
