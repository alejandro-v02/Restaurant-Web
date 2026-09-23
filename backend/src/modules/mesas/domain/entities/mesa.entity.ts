export enum EstadoMesa {
  LIBRE = 'LIBRE',
  OCUPADA = 'OCUPADA',
  RESERVADA = 'RESERVADA',
  INACTIVA = 'INACTIVA',
}

export class Mesa {
  id!: string;
  numero!: number;
  capacidad!: number;
  estado: EstadoMesa = EstadoMesa.LIBRE;
  meseroId?: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial?: Partial<Mesa>) {
    if (partial) Object.assign(this, partial);
  }
}
