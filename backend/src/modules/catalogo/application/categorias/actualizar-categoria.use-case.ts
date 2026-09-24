import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORIA_REPOSITORY } from '../../domain/ports/categoria.repository.port';
import type { CategoriaRepository } from '../../domain/ports/categoria.repository.port';
import { Categoria } from '../../domain/entities/categoria.entity';

export interface ActualizarCategoriaInput {
  nombre?: string;
  orden?: number;
  activo?: boolean;
  enviarACocina?: boolean;
}

@Injectable()
export class ActualizarCategoriaUseCase {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepository,
  ) {}

  async execute(id: string, input: ActualizarCategoriaInput): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findById(id);
    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    Object.assign(categoria, input);
    await this.categoriaRepository.save(categoria);

    return (await this.categoriaRepository.findById(id))!;
  }
}
