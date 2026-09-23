import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { CATEGORIA_REPOSITORY } from '../../domain/ports/categoria.repository.port';
import type { CategoriaRepository } from '../../domain/ports/categoria.repository.port';

@Injectable()
export class EliminarCategoriaUseCase {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const categoria = await this.categoriaRepository.findById(id);
    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    try {
      await this.categoriaRepository.delete(id);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException(
          'No se puede eliminar la categoría: todavía tiene productos asociados',
        );
      }
      throw error;
    }
  }
}
