import { Inject, Injectable } from '@nestjs/common';
import { TURNO_REPOSITORY } from '../domain/ports/turno.repository.port';
import type { TurnoRepository } from '../domain/ports/turno.repository.port';
import { Turno } from '../domain/entities/turno.entity';

@Injectable()
export class ObtenerTurnoActivoUseCase {
  constructor(
    @Inject(TURNO_REPOSITORY) private readonly turnoRepository: TurnoRepository,
  ) {}

  execute(cajeroId: string): Promise<Turno | null> {
    return this.turnoRepository.findAbiertoPorCajero(cajeroId);
  }
}
