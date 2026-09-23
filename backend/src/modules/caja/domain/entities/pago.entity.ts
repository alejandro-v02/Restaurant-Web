export enum MetodoPago {
  EFECTIVO = 'EFECTIVO',
  TARJETA = 'TARJETA',
  TRANSFERENCIA = 'TRANSFERENCIA',
  OTRO = 'OTRO',
}

export class Pago {
  id!: string;
  pedidoId!: string;
  turnoId!: string;
  metodo!: MetodoPago;
  monto!: number;
  propina: number = 0;
  createdAt!: Date;

  constructor(partial?: Partial<Pago>) {
    if (partial) Object.assign(this, partial);
  }
}
