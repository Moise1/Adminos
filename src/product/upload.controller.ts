import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {diskStorage} from 'multer';
import {extname} from 'path';

@Controller()
export class UploadController {

@Post('upload')
@UseInterceptors(
    FileInterceptor('image',  {
        storage: diskStorage({
            destination: './uploads',
            filename(_, file, cb){
                const randName = Array(32).fill(null).map(()=>(Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randName}${extname(file.originalname)}`)
            }
        })
    }))
    
uploadFile(@UploadedFile() file) {
  return {
      url: `http://localhost:8000/api/${file.path}`
  }
};

@Get('uploads/:path')
getImage(
    @Param('path') path,
    @Res() response: Response
){ 
    response.sendFile(path, {root: 'uploads'})
}
}