import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: any) {
    const hashed = await bcrypt.hash(data.password, 10);
    if (data.role === 'ADMIN') {
      const existingAdmin = await this.prisma.user.findFirst({
        where: { role: 'ADMIN' },
      });

      if (existingAdmin) {
        throw new ForbiddenException(
          'Ya existe un administrador en el sistema',
        );
      }
    }

    return this.prisma.user.create({
      data: {
        name: data.name,
        user_name: data.user_name,
        password: hashed,
        role: data.role ?? Role.SYSTEM,
      },
    });
  }

  async updateUser(id: string, data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    if (data.role === 'ADMIN') {
      const existingAdmin = await this.prisma.user.findFirst({
        where: { role: 'ADMIN' },
      });

      if (existingAdmin && existingAdmin.id !== id) {
        throw new ForbiddenException(
          'Ya existe un administrador en el sistema',
        );
      }
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, user_name: true, role: true },
    });
  }

async findAll() {
  return this.prisma.user.findMany({
    orderBy: {
      createdAt: 'asc', // más nuevos arriba
    },
    select: {
      id: true,
      name: true,
      user_name: true,
      role: true,
      createdAt: true,
    },
  });
}

async findByName(name: string) {
  return this.prisma.user.findMany({
    where: {
      name: {
        equals: name,
        mode: 'insensitive', // ignora mayúsculas
      },
    },
  });
}

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.prisma.user.delete({
      where: { id },
      select: { id: true, name: true, user_name: true, role: true },
    });
  }
}
