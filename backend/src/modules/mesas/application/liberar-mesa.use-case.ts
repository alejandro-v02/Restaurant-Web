import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MESA_REPOSITORY } from '../domain/ports/mesa.repository.port';
import type { MesaRepository } from '../domain/ports/mesa.repository.port';
import { EstadoMesa, Mesa } from '../domain/entities/mesa.entity';

@Injectable()
export class LiberarMesaUseCase {
  constructor(
    @Inject(MESA_REPOSITORY) private readonly mesaRepository: MesaRepository,
  ) {}

  async execute(mesaId: string, meseroId: string, esSupervisor: boolean): Promise<Mesa> {
    const mesa = await this.mesaRepository.findById(mesaId);
    if (!mesa) {
      throw new NotFoundException('Mesa no encontrada');
    }

    if (!esSupervisor && mesa.meseroId !== meseroId) {
      throw new ForbiddenException('Solo puedes liberar tus propias mesas');
    }

    mesa.meseroId = null;
    mesa.estado = EstadoMesa.LIBRE;
    await this.mesaRepository.save(mesa);

    return (await this.mesaRepository.findById(mesaId))!;
  }
}
