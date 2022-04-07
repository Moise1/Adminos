import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { ProductModule } from 'src/product/product.module';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CommonModule,
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  // Exported to be use by auth.module.ts to avoid circular imports issue
  exports: [UserService]
})
export class UserModule {}
