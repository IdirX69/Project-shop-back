import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Roles } from '../decorators/roles.decorators';
import { User } from '@prisma/client';
import { PrismaService } from 'src/users/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      Roles,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Récupérer l'utilisateur depuis la base de données
    const dbUser: User = await this.prisma.user.findUnique({
      where: { id: user.userId },
    });

    if (!dbUser) {
      return false;
    }

    return requiredRoles.some((role) => dbUser.roles.includes(role));
  }
}
