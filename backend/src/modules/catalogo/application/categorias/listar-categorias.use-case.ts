import { Inject, Injectable } from '@nestjs/common';
import { CATEGORIA_REPOSITORY } from '../../domain/ports/categoria.repository.port';
import type { CategoriaRepository } from '../../domain/ports/categoria.repository.port';
import { Categoria } from '../../domain/entities/categoria.entity';

@Injectable()
export class ListarCategoriasUseCase {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepository,
  ) {}

  execute(): Promise<Categoria[]> {
    return this.categoriaRepository.findAll();
  }
}
