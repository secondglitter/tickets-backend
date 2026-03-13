import { Controller, Post, Get, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards, Req } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

@Post('login')
async login(
  @Body() body,
  @Res({ passthrough: true }) res: Response,
) {
  const result = await this.authService.login(
    body.user_name,
    body.password,
  );

  res.cookie('token', result.access_token, {
    httpOnly: true,
    sameSite: 'lax',
  });

  return { message: 'Login exitoso'};
}
@Post('logout')
logout(@Res({ passthrough: true }) res: Response) {
  res.clearCookie('token');
  return { message: 'Logout exitoso' };
}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}