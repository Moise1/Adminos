import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { AuthGuard } from 'src/auth/auth.guard';
import { HasPermission } from '../permission/has-perm.decor';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';
import { OrderService } from './order.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('orders')
  @HasPermission('orders')
  all(@Query('page') page: number = 1) {
    return this.orderService.paginate(page, ['orderItems']);
  }

  @Post('export')
  @HasPermission('orders')
  async export(@Res() res: Response) {
    const parser = new Parser({
      fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity'],
    });

    const orders = await this.orderService.all(['orderItems']);

    const json = [];

    orders.forEach((o: Order) => {
      json.push({
        ID: o.id,
        Name: o.name,
        Email: o.email,
        'Product Title': '',
        Price: '',
        Quantity: '',
      });

      o.orderItems.forEach((i: OrderItem) => {
        json.push({
          ID: '',
          Name: '',
          Email: '',
          'Product Title': i.product_title,
          Price: i.price,
          Quantity: i.quantity,
        });
      });
      const csv = parser.parse(json);
      res.header('Content-Type', 'text/csv');
      res.attachment('orders.csv');
      return res.send(csv);
    });
  }

  @Get('chart')
  @HasPermission('orders')
  chart() {
    return this.orderService.chart();
  }
}
