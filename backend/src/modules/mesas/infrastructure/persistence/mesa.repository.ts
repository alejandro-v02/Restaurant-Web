import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from '../../domain/entities/mesa.entity';
import { MesaRepository } from '../../domain/ports/mesa.repository.port';
import { MesaOrmEntity } from './mesa.orm-entity';

@Injectable()
export class TypeOrmMesaRepository implements MesaRepository {
  constructor(
    @InjectRepository(MesaOrmEntity)
    private readonly repo: Repository<Mesa>,
  ) {}

  findById(id: string): Promise<Mesa | null> {
    return this.repo.findOneBy({ id });
  }

  findAll(): Promise<Mesa[]> {
    return this.repo.find({ order: { numero: 'ASC' } });
  }

  save(mesa: Mesa): Promise<Mesa> {
    return this.repo.save(mesa);
  }
}
