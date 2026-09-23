import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService, SesionIniciada } from '../../application/auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginPinDto } from './dto/login-pin.dto';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { Usuario } from '../../../usuarios/domain/entities/usuario.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto): Promise<SesionIniciada> {
    return this.authService.loginConCredenciales(dto.email, dto.password);
  }

  @Post('login-pin')
  @HttpCode(200)
  loginPin(@Body() dto: LoginPinDto): Promise<SesionIniciada> {
    return this.authService.loginConPin(dto.codigo, dto.pin);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() usuario: Usuario) {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
      email: usuario.email,
      codigo: usuario.codigo,
    };
  }
}
