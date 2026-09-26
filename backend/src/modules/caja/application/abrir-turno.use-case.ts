import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { TURNO_REPOSITORY } from '../domain/ports/turno.repository.port';
import type { TurnoRepository } from '../domain/ports/turno.repository.port';
import { Turno } from '../domain/entities/turno.entity';

@Injectable()
export class AbrirTurnoUseCase {
  constructor(
    @Inject(TURNO_REPOSITORY) private readonly turnoRepository: TurnoRepository,
  ) {}

  async execute(cajeroId: string, montoApertura: number): Promise<Turno> {
    const turnoAbierto = await this.turnoRepository.findAbiertoPorCajero(cajeroId);
    if (turnoAbierto) {
      throw new ConflictException('Ya tenés un turno de caja abierto');
    }

    const turno = new Turno({
      cajeroId,
      fechaApertura: new Date(),
      montoApertura,
    });

    return this.turnoRepository.save(turno);
  }
}
