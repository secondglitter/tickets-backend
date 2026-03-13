import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(user_name: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_name },
    });

    if (!user) throw new UnauthorizedException();

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException();

    const payload = {
      sub: user.id,
      name: user.name,
      user_name: user.user_name,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}