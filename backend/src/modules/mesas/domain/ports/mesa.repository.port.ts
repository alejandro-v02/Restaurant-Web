import { Mesa } from '../entities/mesa.entity';

export const MESA_REPOSITORY = Symbol('MESA_REPOSITORY');

export interface MesaRepository {
  findById(id: string): Promise<Mesa | null>;
  findAll(): Promise<Mesa[]>;
  save(mesa: Mesa): Promise<Mesa>;
}
