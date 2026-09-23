export enum EstadoPedidoItem {
  PENDIENTE = 'PENDIENTE',
  EN_PREPARACION = 'EN_PREPARACION',
  LISTO = 'LISTO',
  ENTREGADO = 'ENTREGADO',
}

export class PedidoItem {
  id!: string;
  pedidoId!: string;
  productoId!: string;
  cantidad!: number;
  precioUnitario!: number;
  notas?: string;
  estado: EstadoPedidoItem = EstadoPedidoItem.PENDIENTE;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial?: Partial<PedidoItem>) {
    if (partial) Object.assign(this, partial);
  }
}
