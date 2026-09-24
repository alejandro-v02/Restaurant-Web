export type EstadoMesa = 'LIBRE' | 'OCUPADA' | 'RESERVADA' | 'INACTIVA';

export interface Mesa {
  id: string;
  numero: number;
  capacidad: number;
  estado: EstadoMesa;
  meseroId?: string | null;
}
