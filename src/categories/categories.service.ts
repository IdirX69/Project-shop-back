import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/users/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(categoryBody: CreateCategoryDto) {
    try {
      const { name } = categoryBody;

      // Log received data for debugging
      console.log('Received category data in service:', {
        name,
      });

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new Error('Name is required and must be a non-empty string');
      }

      const createdCategory = await this.prisma.category.create({
        data: {
          name,
        },
      });

      return createdCategory;
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async findAll() {
    const categories = await this.prisma.category.findMany();
    return categories;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { name } = updateCategoryDto;
    const editedCategory = await this.prisma.category.update({
      where: { id: id },
      data: { name },
    });

    return editedCategory;
  }

  async remove(id: number) {
    const deletedCategory = await this.prisma.category.delete({
      where: { id: id },
    });

    return `This action removes a #${deletedCategory.name} category`;
  }
}
