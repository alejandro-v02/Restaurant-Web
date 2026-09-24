import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { RolUsuario, Usuario } from '../../../usuarios/domain/entities/usuario.entity';
import { CrearPedidoUseCase } from '../../application/crear-pedido.use-case';
import { AgregarItemPedidoUseCase } from '../../application/agregar-item-pedido.use-case';
import { EliminarItemPedidoUseCase } from '../../application/eliminar-item-pedido.use-case';
import { EnviarPedidoCocinaUseCase } from '../../application/enviar-pedido-cocina.use-case';
import { ObtenerPedidoActivoUseCase } from '../../application/obtener-pedido-activo.use-case';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { AgregarItemDto } from './dto/agregar-item.dto';

@Controller('pedidos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PedidosController {
  constructor(
    private readonly crearPedido: CrearPedidoUseCase,
    private readonly agregarItem: AgregarItemPedidoUseCase,
    private readonly eliminarItem: EliminarItemPedidoUseCase,
    private readonly enviarACocina: EnviarPedidoCocinaUseCase,
    private readonly obtenerActivo: ObtenerPedidoActivoUseCase,
  ) {}

  @Get('mesa/:mesaId')
  @Roles(RolUsuario.MESERO, RolUsuario.CAJERO, RolUsuario.ADMIN, RolUsuario.COCINA)
  obtenerPorMesa(@Param('mesaId', ParseUUIDPipe) mesaId: string) {
    return this.obtenerActivo.execute(mesaId);
  }

  @Post()
  @Roles(RolUsuario.MESERO, RolUsuario.CAJERO, RolUsuario.ADMIN)
  crear(@Body() dto: CrearPedidoDto, @CurrentUser() usuario: Usuario) {
    return this.crearPedido.execute(
      dto.mesaId,
      usuario.id,
      usuario.rol !== RolUsuario.MESERO,
      dto.personas,
    );
  }

  @Post(':id/items')
  @Roles(RolUsuario.MESERO, RolUsuario.CAJERO, RolUsuario.ADMIN)
  agregarItemPedido(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AgregarItemDto,
    @CurrentUser() usuario: Usuario,
  ) {
    return this.agregarItem.execute(id, usuario.id, usuario.rol !== RolUsuario.MESERO, dto);
  }

  @Delete('items/:itemId')
  @Roles(RolUsuario.MESERO, RolUsuario.CAJERO, RolUsuario.ADMIN)
  @HttpCode(204)
  async eliminarItemPedido(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @CurrentUser() usuario: Usuario,
  ) {
    await this.eliminarItem.execute(itemId, usuario.id, usuario.rol !== RolUsuario.MESERO);
  }

  @Patch(':id/enviar')
  @Roles(RolUsuario.MESERO, RolUsuario.CAJERO, RolUsuario.ADMIN)
  enviar(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() usuario: Usuario) {
    return this.enviarACocina.execute(id, usuario.id, usuario.rol !== RolUsuario.MESERO);
  }
}
