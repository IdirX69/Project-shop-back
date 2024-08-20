/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Get } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from './prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({});
    return users;
  }

  create(CreateUserDto: CreateUserDto) {
    return `This action returns a # user`;
  }
  async findOne(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { firstname, lastname, email, address } = updateUserDto;
    const updatedUser = await this.prisma.user.update({
      where: { id: id },
      data: { firstname, lastname, email, address },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
