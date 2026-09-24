import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MESA_REPOSITORY } from '../domain/ports/mesa.repository.port';
import type { MesaRepository } from '../domain/ports/mesa.repository.port';
import { EstadoMesa, Mesa } from '../domain/entities/mesa.entity';

@Injectable()
export class TomarMesaUseCase {
  constructor(
    @Inject(MESA_REPOSITORY) private readonly mesaRepository: MesaRepository,
  ) {}

  async execute(mesaId: string, meseroId: string): Promise<Mesa> {
    const mesa = await this.mesaRepository.findById(mesaId);
    if (!mesa) {
      throw new NotFoundException('Mesa no encontrada');
    }

    if (mesa.meseroId && mesa.meseroId !== meseroId) {
      throw new ConflictException('La mesa ya está siendo atendida por otro mesero');
    }

    if (mesa.estado !== EstadoMesa.LIBRE && mesa.meseroId !== meseroId) {
      throw new ConflictException('La mesa no está disponible');
    }

    mesa.meseroId = meseroId;
    mesa.estado = EstadoMesa.OCUPADA;
    await this.mesaRepository.save(mesa);

    return (await this.mesaRepository.findById(mesaId))!;
  }
}
