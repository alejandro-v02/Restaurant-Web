import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../../domain/entities/categoria.entity';
import { CategoriaRepository } from '../../domain/ports/categoria.repository.port';
import { CategoriaOrmEntity } from './categoria.orm-entity';

@Injectable()
export class TypeOrmCategoriaRepository implements CategoriaRepository {
  constructor(
    @InjectRepository(CategoriaOrmEntity)
    private readonly repo: Repository<Categoria>,
  ) {}

  findById(id: string): Promise<Categoria | null> {
    return this.repo.findOneBy({ id });
  }

  findAll(): Promise<Categoria[]> {
    return this.repo.find({ order: { orden: 'ASC' } });
  }

  save(categoria: Categoria): Promise<Categoria> {
    return this.repo.save(categoria);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
