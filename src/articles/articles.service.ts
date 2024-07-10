import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(articleBody: CreateArticleDto) {
    try {
      const { name, price, description, image } = articleBody;

      // Log received data for debugging
      console.log('Received article data in service:', {
        name,
        price,
        description,
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
          name,
          description,
          price: parseFloat(price),
          image,
        },
      });

      return createdArticle;
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async findAll() {
    const products = await this.prisma.product.findMany({});
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

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
