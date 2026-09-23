export enum EstadoPedido {
  ABIERTO = 'ABIERTO',
  ENVIADO_COCINA = 'ENVIADO_COCINA',
  SERVIDO = 'SERVIDO',
  CERRADO = 'CERRADO',
  CANCELADO = 'CANCELADO',
}

export class Pedido {
  id!: string;
  mesaId!: string;
  meseroId!: string;
  clienteId?: string;
  estado: EstadoPedido = EstadoPedido.ABIERTO;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial?: Partial<Pedido>) {
    if (partial) Object.assign(this, partial);
  }
}
