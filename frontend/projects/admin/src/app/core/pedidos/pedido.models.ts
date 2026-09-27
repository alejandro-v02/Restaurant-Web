export type EstadoPedido = 'ABIERTO' | 'ENVIADO_COCINA' | 'SERVIDO' | 'CERRADO' | 'CANCELADO';
export type EstadoPedidoItem = 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO';

export interface Pedido {
  id: string;
  mesaId: string;
  meseroId: string;
  personas: number;
  estado: EstadoPedido;
}

export interface PedidoItem {
  id: string;
  pedidoId: string;
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  notas?: string;
  estado: EstadoPedidoItem;
}

export interface PedidoActivo {
  pedido: Pedido;
  items: PedidoItem[];
}
