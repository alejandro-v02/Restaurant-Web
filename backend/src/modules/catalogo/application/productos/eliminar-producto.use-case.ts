import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { PRODUCTO_REPOSITORY } from '../../domain/ports/producto.repository.port';
import type { ProductoRepository } from '../../domain/ports/producto.repository.port';

@Injectable()
export class EliminarProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const producto = await this.productoRepository.findById(id);
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    try {
      await this.productoRepository.delete(id);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException(
          'No se puede eliminar el producto: todavía tiene pedidos asociados',
        );
      }
      throw error;
    }
  }
}
