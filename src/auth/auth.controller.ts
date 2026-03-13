import { Controller, Post, Body, Res, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { JwtAuthGuard } from './jwt/jwt.guard';  // Asegúrate de que el guard JWT esté configurado correctamente

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Endpoint de login
  @Post('login')
  async login(@Body() body, @Res({ passthrough: true }) res: Response) {
    // Autenticación y generación del token
    const result = await this.authService.login(body.user_name, body.password);

    // Establecer la cookie con el token JWT
    res.cookie('token', result.access_token, {
      httpOnly: true,   // No accesible desde JS
      secure: process.env.NODE_ENV === 'production', // Solo en producción (si usas HTTPS)
      sameSite: 'none', // Permitir solicitudes cross-origin
      path: '/', // Asegura que la cookie esté disponible en todas las rutas
    });

    return { message: 'Login exitoso' };
  }

  // Endpoint de logout
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');  // Borrar la cookie cuando el usuario se desloguee
    return { message: 'Logout exitoso' };
  }

  // Ruta protegida por el guard JWT (para el dashboard u otras rutas)
  @UseGuards(JwtAuthGuard) // Proteger la ruta con el guard JWT
  @Get('dashboard')  // O cualquier otra ruta protegida
  getDashboard(@Req() req: any) {
    // Si el token es válido, devolver información relacionada con el dashboard
    return { message: 'Bienvenido al Dashboard', user: req.user };
  }
}