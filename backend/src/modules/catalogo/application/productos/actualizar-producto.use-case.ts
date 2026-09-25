import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCTO_REPOSITORY } from '../../domain/ports/producto.repository.port';
import type { ProductoRepository } from '../../domain/ports/producto.repository.port';
import { CATEGORIA_REPOSITORY } from '../../domain/ports/categoria.repository.port';
import type { CategoriaRepository } from '../../domain/ports/categoria.repository.port';
import { Producto, TipoImpuesto } from '../../domain/entities/producto.entity';

export interface ActualizarProductoInput {
  categoriaId?: string;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  tipoImpuesto?: TipoImpuesto;
  disponible?: boolean;
  enviarACocina?: boolean;
}

@Injectable()
export class ActualizarProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepository,
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepository,
  ) {}

  async execute(id: string, input: ActualizarProductoInput): Promise<Producto> {
    const producto = await this.productoRepository.findById(id);
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (input.categoriaId) {
      const categoria = await this.categoriaRepository.findById(input.categoriaId);
      if (!categoria) {
        throw new NotFoundException('La categoría indicada no existe');
      }
    }

    Object.assign(producto, input);
    await this.productoRepository.save(producto);

    return (await this.productoRepository.findById(id))!;
  }
}
