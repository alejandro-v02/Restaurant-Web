import { Categoria } from '../entities/categoria.entity';

export const CATEGORIA_REPOSITORY = Symbol('CATEGORIA_REPOSITORY');

export interface CategoriaRepository {
  findById(id: string): Promise<Categoria | null>;
  findAll(): Promise<Categoria[]>;
  save(categoria: Categoria): Promise<Categoria>;
  delete(id: string): Promise<void>;
}
