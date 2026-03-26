import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🔒 Validar que sea ADMIN
  private checkAdmin(req: any) {
    if (req.user.role !== 'ADMIN') { // 👈 directo sin enum
      throw new ForbiddenException(
        'Solo el administrador puede acceder a esta sección',
      );
    }
  }

  @Post()
  create(@Body() data: any, @Req() req: any) {
    this.checkAdmin(req);
    return this.usersService.createUser(data);
  }

  @Get()
  findAll(@Req() req: any) {
    this.checkAdmin(req);
    return this.usersService.findAll();
  }

  @Get('name/:name')
  findByName(@Param('name') name: string) {
    return this.usersService.findByName(name);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: any,
    @Req() req: any,
  ) {
    this.checkAdmin(req);
    return this.usersService.updateUser(id, data);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    this.checkAdmin(req);

    if (id === req.user.sub) {
      throw new ForbiddenException(
        'No puedes eliminar tu propio usuario',
      );
    }

    return this.usersService.deleteUser(id);
  }
}