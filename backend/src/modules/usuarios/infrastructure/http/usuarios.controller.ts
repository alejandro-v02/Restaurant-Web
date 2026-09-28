import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { RolUsuario } from '../../domain/entities/usuario.entity';
import { CrearUsuarioUseCase } from '../../application/crear-usuario.use-case';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN)
export class UsuariosController {
  constructor(private readonly crearUsuario: CrearUsuarioUseCase) {}

  @Post()
  crear(@Body() dto: CrearUsuarioDto) {
    return this.crearUsuario.execute(dto);
  }
}
