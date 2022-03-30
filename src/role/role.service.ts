import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async all(): Promise<Role[]>{
      return await this.roleRepository.find();
  };

  async create(name): Promise<Role> {
    return await this.roleRepository.save(name);
  }

  async findOne(condition): Promise<Role> {
    const role = await this.roleRepository.findOne(condition);
    if (!role) throw new NotFoundException('role not found');
    return role;
  }

  async update(id: number, data): Promise<any> {
    return this.roleRepository.update(id, data);
  }

  async delete(id: number): Promise<any> {
    const role = await this.roleRepository.findOne(id);
    if (!role) throw new NotFoundException('role not found');
    return this.roleRepository.delete(id);
  }
}

