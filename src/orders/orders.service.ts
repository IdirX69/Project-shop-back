import { Injectable } from '@nestjs/common';

import { Order, Prisma } from '@prisma/client';
import { PrismaService } from 'src/users/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(data: {
    userId: number;
    items: { productId: number; quantity: number }[];
  }): Promise<Order> {
    const { userId, items } = data;

    // Récupérer les détails des produits pour calculer le total
    let total = 0;
    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        select: { price: true },
      });

      if (product) {
        total += item.quantity * product.price;
      }
    }

    const order = await this.prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        total,
        status: 'pending',
        items: {
          create: items.map((item) => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
          })),
        },
      },
    });
    return order;
  }

  async getOrders(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            firstname: true,
            email: true,
            address: true,
          },
        },
        items: {
          select: {
            quantity: true,
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }

  async getOrderById(id: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstname: true,
            email: true,
            address: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
  async updateOrder(id: number, data: Prisma.OrderUpdateInput): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data,
    });
  }

  async deleteOrder(id: number): Promise<Order> {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
