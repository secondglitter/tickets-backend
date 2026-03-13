import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Función para verificar si las credenciales del usuario son correctas
  private async validateUser(user_name: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_name },
    });

    // Si el usuario no existe
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verificación de la contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  // Generación del payload y el token JWT
  private generateJwtToken(user: any) {
    const payload = {
      sub: user.id,
      name: user.name,
      user_name: user.user_name,
      role: user.role,
    };

    return this.jwtService.sign(payload);  // Firmar el token con el payload
  }

  // Método principal de login
  async login(user_name: string, password: string) {
    let user;

    try {
      // Validación del usuario y la contraseña
      user = await this.validateUser(user_name, password);
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }

    // Generar el token JWT
    const access_token = this.generateJwtToken(user);

    return {
      access_token,
    };
  }
}