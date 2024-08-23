import { Injectable } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(productBody: CreateProductDto) {
    console.log('productBody', productBody);

    try {
      const { name, price, description, categoryId, image } = productBody;

      // Log received data for debugging
      console.log('Received product data in service:', {
        name,
        price,
        description,
        categoryId,
        image,
      });

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new Error('Name is required and must be a non-empty string');
      }
      if (
        !description ||
        typeof description !== 'string' ||
        description.trim().length === 0
      ) {
        throw new Error(
          'Description is required and must be a non-empty string',
        );
      }
      if (!image || typeof image !== 'string' || image.trim().length === 0) {
        throw new Error('Image is required and must be a non-empty string');
      }
      if (isNaN(Number(price))) {
        throw new Error('Price must be a valid number');
      }

      const createdArticle = await this.prisma.product.create({
        data: {
          name: name,
          description: description,
          price: parseInt(price),
          categoryId: parseInt(categoryId),
          image: image,
        },
      });

      return createdArticle;
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      include: { category: true },
    });
    return products;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    return product;
  }

  async update(id: number, productBody: UpdateProductDto) {
    console.log('productBody', productBody);

    const productToUpdate = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    const imagePath = path.join('uploads', productToUpdate.image);

    const { name, description, price, categoryId, image } = productBody;

    if (image !== productToUpdate.image) fs.unlinkSync(imagePath);

    const product = await this.prisma.product.update({
      where: { id: id },
      data: {
        name,
        description,
        price: parseInt(price),
        categoryId: parseInt(categoryId),
        image,
      },
    });
    return product;
  }

  async remove(id: number) {
    // Obtenir l'product et son image associée
    const product = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const imagePath = path.join('uploads', product.image);
    console.log(product);

    try {
      const deletedProduct = await this.prisma.product.delete({
        where: {
          id: id,
        },
      });
      fs.unlinkSync(imagePath);

      console.log('delete' + deletedProduct);
      return deletedProduct;
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}
