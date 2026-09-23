import { Producto } from '../entities/producto.entity';

export const PRODUCTO_REPOSITORY = Symbol('PRODUCTO_REPOSITORY');

export interface ProductoRepository {
  findById(id: string): Promise<Producto | null>;
  findAll(): Promise<Producto[]>;
  findByCategoria(categoriaId: string): Promise<Producto[]>;
  save(producto: Producto): Promise<Producto>;
  delete(id: string): Promise<void>;
}
