import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCTO_REPOSITORY } from '../../domain/ports/producto.repository.port';
import type { ProductoRepository } from '../../domain/ports/producto.repository.port';
import { CATEGORIA_REPOSITORY } from '../../domain/ports/categoria.repository.port';
import type { CategoriaRepository } from '../../domain/ports/categoria.repository.port';
import { Producto, TipoImpuesto } from '../../domain/entities/producto.entity';

export interface CrearProductoInput {
  categoriaId: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  tipoImpuesto?: TipoImpuesto;
  enviarACocina?: boolean;
}

@Injectable()
export class CrearProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepository,
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepository,
  ) {}

  async execute(input: CrearProductoInput): Promise<Producto> {
    const categoria = await this.categoriaRepository.findById(input.categoriaId);
    if (!categoria) {
      throw new NotFoundException('La categoría indicada no existe');
    }

    const producto = new Producto({
      categoriaId: input.categoriaId,
      nombre: input.nombre,
      descripcion: input.descripcion,
      precio: input.precio,
      tipoImpuesto: input.tipoImpuesto ?? TipoImpuesto.EXCLUIDO,
      enviarACocina: input.enviarACocina ?? true,
    });

    return this.productoRepository.save(producto);
  }
}
