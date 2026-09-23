import { Inject, Injectable } from '@nestjs/common';
import { PRODUCTO_REPOSITORY } from '../../domain/ports/producto.repository.port';
import type { ProductoRepository } from '../../domain/ports/producto.repository.port';
import { Producto } from '../../domain/entities/producto.entity';

@Injectable()
export class ListarProductosUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepository,
  ) {}

  execute(categoriaId?: string): Promise<Producto[]> {
    if (categoriaId) {
      return this.productoRepository.findByCategoria(categoriaId);
    }
    return this.productoRepository.findAll();
  }
}
