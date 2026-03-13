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
    // 1. Hacer login y obtener el token
    const result = await this.authService.login(body.user_name, body.password);

    // 2. Establecer la cookie con el token
    res.cookie('token', result.access_token, {
      httpOnly: true, // El frontend no puede leer esta cookie (más seguro)
      secure: true,   // Esto requiere HTTPS en producción
      sameSite: 'none', // Permite cookies en peticiones cross-origin (CORS)
    });

    // 3. Enviar respuesta de éxito
    return { message: 'Login exitoso' };
  }

@Post('logout')
logout(@Res({ passthrough: true }) res: Response) {
  res.clearCookie('token');
  return { message: 'Logout exitoso' };
}
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user; // Esto devuelve la información del usuario si el token es válido
  }
}