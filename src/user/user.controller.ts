import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
  Req,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './models/user.entity';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './user-update.dto';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(
      private userService: UserService,
      private authService: AuthService
    ) {}

  @Get()
  all(@Query('page') page: number = 1) {
    return this.userService.paginate(page);
  }

  @Post()
  async create(@Body() body: UserCreateDto): Promise<User> {
    const password = await bcrypt.hash('1234', 12);
    const { role_id, ...rest } = body;
    return this.userService.create({
      ...rest,
      password,
      role: { id: role_id },
    });
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Put('info')
  async updateInfo(
      @Body() body: UserUpdateDto,
      @Req() request: Request
    ) {
    const  id = await this.authService.userId(request);
    await this.userService.update(id, body);
    return this.userService.findOne({ id });
  }

  @Put('update-password')
  async updatePassword(
      @Body('password') password: UserUpdateDto['password'],
      @Body('confirmPassword') confirmPassword: UserUpdateDto['confirmPassword'],
      @Req() request: Request
  ) {
      const hashedPswd = await bcrypt.hash(password, 12);
      const  id = await this.authService.userId(request);
    if (password !== confirmPassword) throw new BadRequestException("Passwords don't match.");
    await this.userService.update(id, {password: hashedPswd});
    return this.userService.findOne({ id });
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: UserUpdateDto) {
    const { role_id, ...rest } = body;
    await this.userService.update(id, {
      ...rest,
      role: { id: role_id },
    });
    return this.userService.findOne({ id });
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.userService.delete(id);
    return { message: `User ${id} successfully deleted.` };
  }
}
