import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { RolUsuario, Usuario } from '../../../usuarios/domain/entities/usuario.entity';
import { AbrirTurnoUseCase } from '../../application/abrir-turno.use-case';
import { ObtenerTurnoActivoUseCase } from '../../application/obtener-turno-activo.use-case';
import { CerrarTurnoUseCase } from '../../application/cerrar-turno.use-case';
import { ListarPedidosServidosUseCase } from '../../application/listar-pedidos-servidos.use-case';
import { CobrarPedidoUseCase } from '../../application/cobrar-pedido.use-case';
import { AbrirTurnoDto } from './dto/abrir-turno.dto';
import { CerrarTurnoDto } from './dto/cerrar-turno.dto';
import { CobrarPedidoDto } from './dto/cobrar-pedido.dto';

@Controller('caja')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.CAJERO, RolUsuario.ADMIN)
export class CajaController {
  constructor(
    private readonly abrirTurno: AbrirTurnoUseCase,
    private readonly obtenerTurnoActivo: ObtenerTurnoActivoUseCase,
    private readonly cerrarTurno: CerrarTurnoUseCase,
    private readonly listarPedidos: ListarPedidosServidosUseCase,
    private readonly cobrarPedido: CobrarPedidoUseCase,
  ) {}

  @Get('turno/activo')
  turnoActivo(@CurrentUser() usuario: Usuario) {
    return this.obtenerTurnoActivo.execute(usuario.id);
  }

  @Post('turno/abrir')
  abrir(@Body() dto: AbrirTurnoDto, @CurrentUser() usuario: Usuario) {
    return this.abrirTurno.execute(usuario.id, dto.montoApertura);
  }

  @Patch('turno/:id/cerrar')
  cerrar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CerrarTurnoDto,
    @CurrentUser() usuario: Usuario,
  ) {
    return this.cerrarTurno.execute(
      id,
      usuario.id,
      usuario.rol === RolUsuario.ADMIN,
      dto.montoCierre,
    );
  }

  @Get('pedidos')
  pedidos() {
    return this.listarPedidos.execute();
  }

  @Patch('pedidos/:id/cobrar')
  cobrar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CobrarPedidoDto,
    @CurrentUser() usuario: Usuario,
  ) {
    return this.cobrarPedido.execute(id, usuario.id, dto);
  }
}
