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
    Query
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './models/user.entity';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './user-update.dto';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

    @Get()
    all(@Query('page') page: number = 1){
        return this.userService.paginate(page);
    };

    @Post()
    async create(@Body() body: UserCreateDto): Promise<User>{
        const password = await bcrypt.hash('1234', 12);
        const {role_id, ...rest} = body;
        return this.userService.create({
            ...rest,
            password,
            role: {id: role_id}
        });
    };

    @Get(':id')
     get( @Param('id') id: number){
        return this.userService.findOne(id);
    };

    @Put(':id')
    async update(
     @Param('id') id: number,
     @Body() body: UserUpdateDto){
        await this.userService.update(id, body);
        return this.get(id);
    };


    @Delete(':id')
    async delete(@Param('id') id: number){
        await this.userService.delete(id);
        return {message: `User ${id} successfully deleted.`}
    }

}
