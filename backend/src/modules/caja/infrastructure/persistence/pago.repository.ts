import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from '../../domain/entities/pago.entity';
import { PagoRepository } from '../../domain/ports/pago.repository.port';
import { PagoOrmEntity } from './pago.orm-entity';

@Injectable()
export class TypeOrmPagoRepository implements PagoRepository {
  constructor(
    @InjectRepository(PagoOrmEntity)
    private readonly repo: Repository<Pago>,
  ) {}

  findById(id: string): Promise<Pago | null> {
    return this.repo.findOneBy({ id });
  }

  findByTurno(turnoId: string): Promise<Pago[]> {
    return this.repo.find({ where: { turnoId } });
  }

  save(pago: Pago): Promise<Pago> {
    return this.repo.save(pago);
  }
}
