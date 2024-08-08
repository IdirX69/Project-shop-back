import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order, Prisma } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Body()
    orderData: {
      userId: number;
      items: { productId: number; quantity: number }[];
    },
  ): Promise<Order> {
    const { userId, items } = orderData;
    return this.ordersService.createOrder({ userId, items });
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order | null> {
    return this.ordersService.getOrderById(Number(id));
  }

  @Get()
  async getOrders(): Promise<Order[]> {
    return this.ordersService.getOrders();
  }

  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() orderData: Prisma.OrderUpdateInput,
  ): Promise<Order> {
    return this.ordersService.updateOrder(Number(id), orderData);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<Order> {
    return this.ordersService.deleteOrder(Number(id));
  }
}
