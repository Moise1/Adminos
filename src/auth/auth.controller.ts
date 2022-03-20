import { BadRequestException, Body, Controller, NotFoundException, Post } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './models/register.dto';


@Controller()
export class AuthController {
    constructor(private userService: UserService){};

    @Post('register')
    async register(@Body() body: RegisterDto){
        if(body.password !== body.confirmPassword) throw new BadRequestException("Passwords don't match.");
        const hashed = await bcrypt.hash(body.password, 12);
        return this.userService.create({...body, password: hashed});
    };

    @Post('login')
    async login(@Body() {email, password}: {email: string; password: string}){
        const hashed = await bcrypt.hash(password, 12);
        const user = await this.userService.findOne({email});
        if(!user) throw new NotFoundException('User not found.');
        if(! await bcrypt.compare(password, user.password)) throw new BadRequestException('Invalid credentials.');

        return user;
    };
}
