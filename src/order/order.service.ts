import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { PaginatedResult } from 'src/common/paginatedResult';

@Injectable()
export class OrderService extends AbstractService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    super(orderRepository);
  }

  async paginate(page: number = 1, relations = []): Promise<PaginatedResult> {
    const { data, meta } = await super.paginate(page, relations);
    return {
      data: data.map((order: Order) => ({
        id: order.id,
        name: order.name,
        total: order.total,
        createdAt: order.total,
        orderItems: order.orderItems,
      })),
      meta,
    };
  }

  chart() {
    return this.orderRepository.query(`
            SELECT DATE_FORMAT(o.createdAt, '%y-%m-%d') as date, sum(i.price * i.quantity) as sum
            FROM orders o
            JOIN order_items i on o.id = i.order_id
            GROUP BY date;
      `);
  }
}
