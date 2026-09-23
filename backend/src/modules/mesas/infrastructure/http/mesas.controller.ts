import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { ListarMesasUseCase } from '../../application/listar-mesas.use-case';
import { AsignarMeseroUseCase } from '../../application/asignar-mesero.use-case';
import { AsignarMeseroDto } from './dto/asignar-mesero.dto';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { RolUsuario } from '../../../usuarios/domain/entities/usuario.entity';

@Controller('mesas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MesasController {
  constructor(
    private readonly listarMesas: ListarMesasUseCase,
    private readonly asignarMesero: AsignarMeseroUseCase,
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
}
