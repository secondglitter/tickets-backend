import { Controller, Post, Get, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body, @Res({ passthrough: true }) res: Response) {
    // Autenticación y generación del token
    const result = await this.authService.login(body.user_name, body.password);

    // Establecer la cookie con el token JWT
    res.cookie('token', result.access_token, {
      httpOnly: true,   // No accesible desde JS
      secure: process.env.NODE_ENV === 'production', // Solo en producción (si usas HTTPS)
      sameSite: 'lax', // Permitir solicitudes cross-origin
      path: '/', // Asegura que la cookie esté disponible en todas las rutas
    });

    return { message: 'Login exitoso' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Logout exitoso' };
  }
}
