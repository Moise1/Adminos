import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateProductDto } from './CreateProductDto';
import { ProductService } from './product.service';

@UseGuards(AuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  all(@Query('page') page: number = 1) {
    return this.productService.paginate(page);
  }

  @Post()
  create(@Body() body: CreateProductDto) {
    return this.productService.create(body);
  };

  @Get(':id')
  get(@Param('id') id: number){
      return this.productService.findOne({id});
  };

  @Put(':id')
  async update(
      @Param('id') id: number,
      @Body() body: CreateProductDto
      ){
      await this.productService.update(id, body);
      return this.productService.findOne({id});
  };

  @Delete(':id')
  async delete(@Param('id') id: number){
    await this.productService.delete(id);
    return {message: `Product ${id} deleted sucessfully.`}
  }
}
