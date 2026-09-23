import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaOrmEntity } from './infrastructure/persistence/categoria.orm-entity';
import { ProductoOrmEntity } from './infrastructure/persistence/producto.orm-entity';
import { TypeOrmCategoriaRepository } from './infrastructure/persistence/categoria.repository';
import { TypeOrmProductoRepository } from './infrastructure/persistence/producto.repository';
import { CATEGORIA_REPOSITORY } from './domain/ports/categoria.repository.port';
import { PRODUCTO_REPOSITORY } from './domain/ports/producto.repository.port';
import { CategoriasController } from './infrastructure/http/categorias.controller';
import { ProductosController } from './infrastructure/http/productos.controller';
import { ListarCategoriasUseCase } from './application/categorias/listar-categorias.use-case';
import { CrearCategoriaUseCase } from './application/categorias/crear-categoria.use-case';
import { ActualizarCategoriaUseCase } from './application/categorias/actualizar-categoria.use-case';
import { EliminarCategoriaUseCase } from './application/categorias/eliminar-categoria.use-case';
import { ListarProductosUseCase } from './application/productos/listar-productos.use-case';
import { CrearProductoUseCase } from './application/productos/crear-producto.use-case';
import { ActualizarProductoUseCase } from './application/productos/actualizar-producto.use-case';
import { EliminarProductoUseCase } from './application/productos/eliminar-producto.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaOrmEntity, ProductoOrmEntity])],
  controllers: [CategoriasController, ProductosController],
  providers: [
    { provide: CATEGORIA_REPOSITORY, useClass: TypeOrmCategoriaRepository },
    { provide: PRODUCTO_REPOSITORY, useClass: TypeOrmProductoRepository },
    ListarCategoriasUseCase,
    CrearCategoriaUseCase,
    ActualizarCategoriaUseCase,
    EliminarCategoriaUseCase,
    ListarProductosUseCase,
    CrearProductoUseCase,
    ActualizarProductoUseCase,
    EliminarProductoUseCase,
  ],
  exports: [CATEGORIA_REPOSITORY, PRODUCTO_REPOSITORY],
})
export class CatalogoModule {}
