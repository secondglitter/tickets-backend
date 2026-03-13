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
  const result = await this.authService.login(body.user_name, body.password);
  
  console.log('Token generado:', result.access_token);  // Agregar log

  res.cookie('token', result.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/',
  });

  return { message: 'Login exitoso' };
}

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Logout exitoso' };
  }
}
