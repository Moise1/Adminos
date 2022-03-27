import {
    Body, 
    ClassSerializerInterceptor, 
    Controller, 
    Get, 
    Param, 
    Post, 
    UseGuards, 
    UseInterceptors 
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './models/user.entity';
import { UserCreateDto } from './user-create.dto';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

    @Get()
    async all(): Promise<User[]>{
        return this.userService.all();
    };

    @Post()
    async create(@Body() body: UserCreateDto): Promise<User>{
        const password = await bcrypt.hash('1234', 12);
        return this.userService.create({...body, password, confirmPassword: password});
    };

    @Get(':id')
    async getOneUser(@Param('id') id: number){
        return this.userService.findOne({id});
    }

}
