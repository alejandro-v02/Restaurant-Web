import { Inject, Injectable } from '@nestjs/common';
import { MESA_REPOSITORY } from '../domain/ports/mesa.repository.port';
import type { MesaRepository } from '../domain/ports/mesa.repository.port';
import { Mesa } from '../domain/entities/mesa.entity';

@Injectable()
export class ListarMesasUseCase {
  constructor(
    @Inject(MESA_REPOSITORY) private readonly mesaRepository: MesaRepository,
  ) {}

  execute(): Promise<Mesa[]> {
    return this.mesaRepository.findAll();
  }
}
