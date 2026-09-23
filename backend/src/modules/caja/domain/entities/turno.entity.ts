export enum EstadoTurno {
  ABIERTO = 'ABIERTO',
  CERRADO = 'CERRADO',
}

export class Turno {
  id!: string;
  cajeroId!: string;
  fechaApertura!: Date;
  fechaCierre?: Date;
  montoApertura!: number;
  montoCierre?: number;
  estado: EstadoTurno = EstadoTurno.ABIERTO;

  constructor(partial?: Partial<Turno>) {
    if (partial) Object.assign(this, partial);
  }
}
