import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { ListarMesasUseCase } from '../../application/listar-mesas.use-case';
import { AsignarMeseroUseCase } from '../../application/asignar-mesero.use-case';
import { TomarMesaUseCase } from '../../application/tomar-mesa.use-case';
import { LiberarMesaUseCase } from '../../application/liberar-mesa.use-case';
import { AsignarMeseroDto } from './dto/asignar-mesero.dto';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { RolUsuario, Usuario } from '../../../usuarios/domain/entities/usuario.entity';

@Controller('mesas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MesasController {
  constructor(
    private readonly listarMesas: ListarMesasUseCase,
    private readonly asignarMesero: AsignarMeseroUseCase,
    private readonly tomarMesa: TomarMesaUseCase,
    private readonly liberarMesa: LiberarMesaUseCase,
  ) {}

  @Get()
  listar() {
    return this.listarMesas.execute();
  }

  @Patch(':id/mesero')
  @Roles(RolUsuario.ADMIN, RolUsuario.CAJERO)
  asignar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AsignarMeseroDto,
  ) {
    return this.asignarMesero.execute(id, dto.meseroId ?? null);
  }

  @Patch(':id/tomar')
  @Roles(RolUsuario.MESERO, RolUsuario.ADMIN, RolUsuario.CAJERO)
  tomar(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() usuario: Usuario) {
    return this.tomarMesa.execute(id, usuario.id);
  }

  @Patch(':id/liberar')
  @Roles(RolUsuario.MESERO, RolUsuario.ADMIN, RolUsuario.CAJERO)
  liberar(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() usuario: Usuario) {
    return this.liberarMesa.execute(id, usuario.id, usuario.rol !== RolUsuario.MESERO);
  }
}
