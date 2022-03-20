import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule], // Used in imports for it includes UserService  avoid circular imports issue.
  controllers: [AuthController]
})
export class AuthModule {}
