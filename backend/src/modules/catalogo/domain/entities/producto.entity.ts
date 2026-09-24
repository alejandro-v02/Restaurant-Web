export enum TipoImpuesto {
  IVA_19 = 'IVA_19',
  INC_8 = 'INC_8',
  EXCLUIDO = 'EXCLUIDO',
}

export class Producto {
  id!: string;
  categoriaId!: string;
  nombre!: string;
  descripcion?: string;
  precio!: number;
  tipoImpuesto: TipoImpuesto = TipoImpuesto.EXCLUIDO;
  disponible: boolean = true;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial?: Partial<Producto>) {
    if (partial) Object.assign(this, partial);
  }
}
