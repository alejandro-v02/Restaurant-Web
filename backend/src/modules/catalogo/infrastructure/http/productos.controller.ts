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
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { RolUsuario } from '../../../usuarios/domain/entities/usuario.entity';
import { ListarProductosUseCase } from '../../application/productos/listar-productos.use-case';
import { CrearProductoUseCase } from '../../application/productos/crear-producto.use-case';
import { ActualizarProductoUseCase } from '../../application/productos/actualizar-producto.use-case';
import { EliminarProductoUseCase } from '../../application/productos/eliminar-producto.use-case';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';

@Controller('productos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductosController {
  constructor(
    private readonly listarProductos: ListarProductosUseCase,
    private readonly crearProducto: CrearProductoUseCase,
    private readonly actualizarProducto: ActualizarProductoUseCase,
    private readonly eliminarProducto: EliminarProductoUseCase,
  ) {}

  @Get()
  listar(@Query('categoriaId') categoriaId?: string) {
    return this.listarProductos.execute(categoriaId);
  }

  @Post()
  @Roles(RolUsuario.ADMIN)
  crear(@Body() dto: CrearProductoDto) {
    return this.crearProducto.execute(dto);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN)
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarProductoDto,
  ) {
    return this.actualizarProducto.execute(id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  @HttpCode(204)
  async eliminar(@Param('id', ParseUUIDPipe) id: string) {
    await this.eliminarProducto.execute(id);
  }
}
