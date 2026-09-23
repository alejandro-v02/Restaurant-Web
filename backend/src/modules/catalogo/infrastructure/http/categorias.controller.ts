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
import { RolUsuario } from '../../../usuarios/domain/entities/usuario.entity';
import { ListarCategoriasUseCase } from '../../application/categorias/listar-categorias.use-case';
import { CrearCategoriaUseCase } from '../../application/categorias/crear-categoria.use-case';
import { ActualizarCategoriaUseCase } from '../../application/categorias/actualizar-categoria.use-case';
import { EliminarCategoriaUseCase } from '../../application/categorias/eliminar-categoria.use-case';
import { CrearCategoriaDto } from './dto/crear-categoria.dto';
import { ActualizarCategoriaDto } from './dto/actualizar-categoria.dto';

@Controller('categorias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriasController {
  constructor(
    private readonly listarCategorias: ListarCategoriasUseCase,
    private readonly crearCategoria: CrearCategoriaUseCase,
    private readonly actualizarCategoria: ActualizarCategoriaUseCase,
    private readonly eliminarCategoria: EliminarCategoriaUseCase,
  ) {}

  @Get()
  listar() {
    return this.listarCategorias.execute();
  }

  @Post()
  @Roles(RolUsuario.ADMIN)
  crear(@Body() dto: CrearCategoriaDto) {
    return this.crearCategoria.execute(dto);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN)
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarCategoriaDto,
  ) {
    return this.actualizarCategoria.execute(id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  @HttpCode(204)
  async eliminar(@Param('id', ParseUUIDPipe) id: string) {
    await this.eliminarCategoria.execute(id);
  }
}
