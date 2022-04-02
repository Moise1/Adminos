import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginatedResult } from './paginatedResult';

@Injectable()
export abstract class AbstractService {

    protected constructor(protected readonly repository: Repository<any>){}
    
    async all( relations = []): Promise<any[]> {
        return await this.repository.find({relations});
      }
    
      async paginate(page: number = 1): Promise<PaginatedResult> {
        const initialUsers: number = 1;
        const [data, total] = await this.repository.findAndCount({
          take: initialUsers,
          skip: (page - 1) * initialUsers,
        });
        return {
          data,
          meta: {
            total,
            page,
            last_page: Math.ceil(total / initialUsers),
          },
        };
      }
      async create(data: any): Promise<any> {
        return await this.repository.save(data);
      }
    
      async findOne(condition, relations = []): Promise<any> {
        const user = await this.repository.findOne(condition, {relations});
        if (!user) throw new NotFoundException('resource not found');
        return user;
      }
    
      async update(id: number, data): Promise<any> {
        return this.repository.update(id, data);
      }
    
      async delete(id: number): Promise<any> {
        const user = await this.repository.findOne(id);
        if (!user) throw new NotFoundException('resource not found');
        return this.repository.delete(id);
      }
}
