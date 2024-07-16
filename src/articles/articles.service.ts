import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(articleBody: CreateArticleDto) {
    try {
      const { name, price, description, categories, image } = articleBody;

      // Log received data for debugging
      console.log('Received article data in service:', {
        name,
        price,
        description,
        categories,
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

      // Validate categories
      const categoryIds = categories.map((catId) => parseInt(catId));
      const validCategories = await this.prisma.category.findMany({
        where: {
          id: { in: categoryIds },
        },
      });

      if (validCategories.length !== categoryIds.length) {
        throw new Error('One or more categories are invalid');
      }

      const createdArticle = await this.prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          categories: {
            connect: categoryIds.map((id) => ({ id })),
          },
          image,
        },
        include: {
          categories: true,
        },
      });

      return createdArticle;
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      include: {
        categories: true,
      },
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

    const { name, description, price, image } = articleBody;

    const product = await this.prisma.product.update({
      where: { id: id },
      data: { name, description, price: parseFloat(price), image },
    });
    return product;
  }

  async remove(id: number) {
    const product = await this.prisma.product.delete({
      where: {
        id: id,
      },
    });
    return product;
  }
}
