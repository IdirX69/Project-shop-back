import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { PrismaService } from 'src/users/prisma.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, PrismaService],
})
export class ArticlesModule {}
