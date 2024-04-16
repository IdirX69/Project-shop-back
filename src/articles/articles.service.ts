import { Injectable, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../articles/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async createArticle({ articleBody }: { articleBody: CreateArticleDto }) {
    try {
      const { name, price, description, image } = articleBody;
      console.log('dto' + price);

      const createdArticle = await this.prisma.product.create({
        data: { name, description, price: parseInt(price), image },
      });
      return createdArticle;
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  findAll() {
    return `This action returns all articles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
