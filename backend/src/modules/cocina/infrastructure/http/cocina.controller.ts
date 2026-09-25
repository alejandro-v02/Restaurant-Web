import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { RolUsuario } from '../../../usuarios/domain/entities/usuario.entity';
import { ListarItemsCocinaUseCase } from '../../application/listar-items-cocina.use-case';
import { ActualizarEstadoItemCocinaUseCase } from '../../application/actualizar-estado-item.use-case';
import { ActualizarEstadoItemDto } from './dto/actualizar-estado-item.dto';

@Controller('cocina')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CocinaController {
  constructor(
    private readonly listarItems: ListarItemsCocinaUseCase,
    private readonly actualizarEstado: ActualizarEstadoItemCocinaUseCase,
  ) {}

  @Get('items')
  @Roles(RolUsuario.COCINA, RolUsuario.ADMIN)
  listar() {
    return this.listarItems.execute();
  }

  @Patch('items/:itemId/estado')
  @Roles(RolUsuario.COCINA, RolUsuario.ADMIN)
  actualizar(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: ActualizarEstadoItemDto,
  ) {
    return this.actualizarEstado.execute(itemId, dto.estado);
  }
}
