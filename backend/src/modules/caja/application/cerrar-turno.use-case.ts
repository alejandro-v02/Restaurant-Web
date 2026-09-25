import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TURNO_REPOSITORY } from '../domain/ports/turno.repository.port';
import type { TurnoRepository } from '../domain/ports/turno.repository.port';
import { EstadoTurno, Turno } from '../domain/entities/turno.entity';

@Injectable()
export class CerrarTurnoUseCase {
  constructor(
    @Inject(TURNO_REPOSITORY) private readonly turnoRepository: TurnoRepository,
  ) {}

  async execute(
    turnoId: string,
    solicitanteId: string,
    esSupervisor: boolean,
    montoCierre: number,
  ): Promise<Turno> {
    const turno = await this.turnoRepository.findById(turnoId);
    if (!turno) {
      throw new NotFoundException('Turno no encontrado');
    }

    if (!esSupervisor && turno.cajeroId !== solicitanteId) {
      throw new ForbiddenException('Ese turno no es tuyo');
    }

    if (turno.estado === EstadoTurno.CERRADO) {
      throw new ConflictException('Ese turno ya está cerrado');
    }

    turno.estado = EstadoTurno.CERRADO;
    turno.fechaCierre = new Date();
    turno.montoCierre = montoCierre;

    return this.turnoRepository.save(turno);
  }
}
