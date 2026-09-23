import { Inject, Injectable } from '@nestjs/common';
import { CATEGORIA_REPOSITORY } from '../../domain/ports/categoria.repository.port';
import type { CategoriaRepository } from '../../domain/ports/categoria.repository.port';
import { Categoria } from '../../domain/entities/categoria.entity';

export interface CrearCategoriaInput {
  nombre: string;
  orden?: number;
}

@Injectable()
export class CrearCategoriaUseCase {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepository,
  ) {}

  execute(input: CrearCategoriaInput): Promise<Categoria> {
    const categoria = new Categoria({ nombre: input.nombre, orden: input.orden ?? 0 });
    return this.categoriaRepository.save(categoria);
  }
}
