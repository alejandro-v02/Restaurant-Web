import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../../domain/entities/producto.entity';
import { ProductoRepository } from '../../domain/ports/producto.repository.port';
import { ProductoOrmEntity } from './producto.orm-entity';

@Injectable()
export class TypeOrmProductoRepository implements ProductoRepository {
  constructor(
    @InjectRepository(ProductoOrmEntity)
    private readonly repo: Repository<Producto>,
  ) {}

  findById(id: string): Promise<Producto | null> {
    return this.repo.findOneBy({ id });
  }

  findAll(): Promise<Producto[]> {
    return this.repo.find();
  }

  findByCategoria(categoriaId: string): Promise<Producto[]> {
    return this.repo.find({ where: { categoriaId } });
  }

  save(producto: Producto): Promise<Producto> {
    return this.repo.save(producto);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
