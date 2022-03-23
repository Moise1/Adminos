import {
    BadRequestException, 
    Body, Controller,
    NotFoundException,
    Get,
    Post, 
    Req,
    Res
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './models/register.dto';


@Controller()
export class AuthController {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}; 

    @Post('register')
    async register(@Body() body: RegisterDto){
        if(body.password !== body.confirmPassword) throw new BadRequestException("Passwords don't match.");
        const hashed = await bcrypt.hash(body.password, 12);
        return this.userService.create({...body, password: hashed});
    };

    @Post('login')
    async login(
        @Body() {email, password}: {email: string; password: string},
        @Res() response: Response
    ){
        const user = await this.userService.findOne({email});
        const jwt = await this.jwtService.signAsync({id: user.id});
        if(!user) throw new NotFoundException('User not found.');
        if(! await bcrypt.compare(password, user.password)) throw new BadRequestException('Invalid credentials.');
        response.cookie('jwt', jwt, {httpOnly: true});
        return user;
    };


    @Get('user')
    async user(@Req() request: Request){
        const cookie = request.cookies['jwt'];
        const data = await this.jwtService.verifyAsync(cookie);
        return this.userService.findOne({id: data.id});
    }
}
