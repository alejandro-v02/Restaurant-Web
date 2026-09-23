import { Pago } from '../entities/pago.entity';

export const PAGO_REPOSITORY = Symbol('PAGO_REPOSITORY');

export interface PagoRepository {
  findById(id: string): Promise<Pago | null>;
  findByTurno(turnoId: string): Promise<Pago[]>;
  save(pago: Pago): Promise<Pago>;
}
