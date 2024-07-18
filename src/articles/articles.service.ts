import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from './prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(articleBody: CreateArticleDto) {
    console.log('articleBody', articleBody);

    try {
      const { name, price, description, categoryId, image } = articleBody;

      // Log received data for debugging
      console.log('Received article data in service:', {
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

  async update(id: number, articleBody: UpdateArticleDto) {
    console.log('articleBody', articleBody);

    const { name, description, price, categoryId, image } = articleBody;

    const product = await this.prisma.product.update({
      where: { id: id },
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        image,
      },
    });
    return product;
  }

  async remove(id: number) {
    // Obtenir l'article et son image associée
    const product = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const imagePath = path.join('uploads', product.image);
    console.log(imagePath);

    try {
      // Supprimer l'image du système de fichiers
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Supprimer le produit de la base de données
      const deletedProduct = await this.prisma.product.delete({
        where: {
          id: id,
        },
      });

      return deletedProduct;
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}
