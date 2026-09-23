import { Cliente } from '../entities/cliente.entity';

export const CLIENTE_REPOSITORY = Symbol('CLIENTE_REPOSITORY');

export interface ClienteRepository {
  findById(id: string): Promise<Cliente | null>;
  findByDocumento(numeroDocumento: string): Promise<Cliente | null>;
  findAll(): Promise<Cliente[]>;
  save(cliente: Cliente): Promise<Cliente>;
}
