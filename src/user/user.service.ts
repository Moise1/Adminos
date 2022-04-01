import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from '../common/abstract.service';
import { PaginatedResult } from '../common/paginatedResult';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';

@Injectable()
export class UserService extends AbstractService{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super(userRepository)
  }


  async paginate(page: number = 1): Promise<PaginatedResult> {
    const {data, meta} = await super.paginate(page);
    return {
      data: data.map(user => {
        const {password, confirmPassword, ...data} = user;
        return data; 
      }),
      meta
    };
  }
  
}
