import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../../domain/entities/cliente.entity';
import { ClienteRepository } from '../../domain/ports/cliente.repository.port';
import { ClienteOrmEntity } from './cliente.orm-entity';

@Injectable()
export class TypeOrmClienteRepository implements ClienteRepository {
  constructor(
    @InjectRepository(ClienteOrmEntity)
    private readonly repo: Repository<Cliente>,
  ) {}

  findById(id: string): Promise<Cliente | null> {
    return this.repo.findOneBy({ id });
  }

  findByDocumento(numeroDocumento: string): Promise<Cliente | null> {
    return this.repo.findOneBy({ numeroDocumento });
  }

  findAll(): Promise<Cliente[]> {
    return this.repo.find();
  }

  save(cliente: Cliente): Promise<Cliente> {
    return this.repo.save(cliente);
  }
}
