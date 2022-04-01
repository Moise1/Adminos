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
  constructor(private readonly roleService: RoleService) {}

  @Get()
  all() {
    return this.roleService.all();
  }

  @Post()
  create(@Body('name') name: Role['name'], @Body('permissions') ids: number[]) {
    return this.roleService.create({
      name,
      permissions: ids?.map((id) => ({ id })),
    });
  }

  @Get(':id')
  get(@Param('id') id: Role['id']) {
    return this.roleService.findOne({id}, ['permissions']);
  }

  @Put(':id')
  async update(
    @Param('id') id: Role['id'],
    @Body('name') name: Role['name'],
    @Body('permissions') ids: number[],
  ) {
    
    await this.roleService.update(id, { name })
    const role = await this.roleService.findOne({id});
    return await this.roleService.create({
      ...role,
      permissions: ids?.map((id) => ({ id })),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: Role['id']) {
    await this.roleService.delete(id);
    return { message: `Role ${id} successfully deleted.` };
  }
}
