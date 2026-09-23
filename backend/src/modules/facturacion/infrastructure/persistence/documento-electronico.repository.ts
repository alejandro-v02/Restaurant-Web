import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentoElectronico } from '../../domain/entities/documento-electronico.entity';
import { DocumentoElectronicoRepository } from '../../domain/ports/documento-electronico.repository.port';
import { DocumentoElectronicoOrmEntity } from './documento-electronico.orm-entity';

@Injectable()
export class TypeOrmDocumentoElectronicoRepository
  implements DocumentoElectronicoRepository
{
  constructor(
    @InjectRepository(DocumentoElectronicoOrmEntity)
    private readonly repo: Repository<DocumentoElectronico>,
  ) {}

  findById(id: string): Promise<DocumentoElectronico | null> {
    return this.repo.findOneBy({ id });
  }

  findByPedido(pedidoId: string): Promise<DocumentoElectronico[]> {
    return this.repo.find({ where: { pedidoId } });
  }

  save(documento: DocumentoElectronico): Promise<DocumentoElectronico> {
    return this.repo.save(documento);
  }
}
