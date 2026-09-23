import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResolucionNumeracion } from '../../domain/entities/resolucion-numeracion.entity';
import { ResolucionNumeracionRepository } from '../../domain/ports/resolucion-numeracion.repository.port';
import { TipoDocumentoElectronico } from '../../domain/entities/documento-electronico.entity';
import { ResolucionNumeracionOrmEntity } from './resolucion-numeracion.orm-entity';

@Injectable()
export class TypeOrmResolucionNumeracionRepository
  implements ResolucionNumeracionRepository
{
  constructor(
    @InjectRepository(ResolucionNumeracionOrmEntity)
    private readonly repo: Repository<ResolucionNumeracion>,
  ) {}

  findById(id: string): Promise<ResolucionNumeracion | null> {
    return this.repo.findOneBy({ id });
  }

  findActivaPorTipo(
    tipoDocumento: TipoDocumentoElectronico,
  ): Promise<ResolucionNumeracion | null> {
    return this.repo.findOneBy({ tipoDocumento, activo: true });
  }

  save(resolucion: ResolucionNumeracion): Promise<ResolucionNumeracion> {
    return this.repo.save(resolucion);
  }
}
