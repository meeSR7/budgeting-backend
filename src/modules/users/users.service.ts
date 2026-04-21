import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { PrismaService } from 'src/prisma/prisma.service';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    // Implement logic to find a user by email using your database
    // For example, if you're using Prisma:
    // return this.prisma.user.findUnique({ where: { email } });

    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(email: string, password: string, name?: string) {
    return this.prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  }

  // Implement other user-related methods as needed
}
