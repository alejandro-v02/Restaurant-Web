import { Turno } from '../entities/turno.entity';

export const TURNO_REPOSITORY = Symbol('TURNO_REPOSITORY');

export interface TurnoRepository {
  findById(id: string): Promise<Turno | null>;
  findAbiertoPorCajero(cajeroId: string): Promise<Turno | null>;
  save(turno: Turno): Promise<Turno>;
}
