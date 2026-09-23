import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno, EstadoTurno } from '../../domain/entities/turno.entity';
import { TurnoRepository } from '../../domain/ports/turno.repository.port';
import { TurnoOrmEntity } from './turno.orm-entity';

@Injectable()
export class TypeOrmTurnoRepository implements TurnoRepository {
  constructor(
    @InjectRepository(TurnoOrmEntity)
    private readonly repo: Repository<Turno>,
  ) {}

  findById(id: string): Promise<Turno | null> {
    return this.repo.findOneBy({ id });
  }

  findAbiertoPorCajero(cajeroId: string): Promise<Turno | null> {
    return this.repo.findOneBy({ cajeroId, estado: EstadoTurno.ABIERTO });
  }

  save(turno: Turno): Promise<Turno> {
    return this.repo.save(turno);
  }
}
