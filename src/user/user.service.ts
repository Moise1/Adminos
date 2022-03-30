import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async all(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async paginate(page: number = 1): Promise<any> {
    const initialUsers: number = 10;
    const [users, total] = await this.userRepository.findAndCount({
      take: initialUsers,
      skip: (page - 1) * initialUsers,
    });
    return {
      data: users,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / initialUsers),
      },
    };
  }
  async create(data: User): Promise<User> {
    return await this.userRepository.save(data);
  }

  async findOne(condition): Promise<User> {
    const user = await this.userRepository.findOne(condition);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async update(id: number, data): Promise<any> {
    return this.userRepository.update(id, data);
  }

  async delete(id: number): Promise<any> {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new NotFoundException('user not found');
    return this.userRepository.delete(id);
  }
}
