import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService){}

  @Get()
  all() {
    return this.roleService.all();
  }

  @Post()
  create(@Body('name') name: Role['name']) {
    return this.roleService.create({name});
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: Role['id'], @Body() name: Role['name']) {
    await this.roleService.update(id, name);
    return this.get(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.roleService.delete(id);
    return { message: `Role ${id} successfully deleted.` };
  }
}
