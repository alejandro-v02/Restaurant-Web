export enum TipoDocumento {
  CC = 'CC',
  CE = 'CE',
  NIT = 'NIT',
  PASAPORTE = 'PASAPORTE',
}

export class Cliente {
  id!: string;
  tipoDocumento!: TipoDocumento;
  numeroDocumento!: string;
  nombre!: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial?: Partial<Cliente>) {
    if (partial) Object.assign(this, partial);
  }
}
