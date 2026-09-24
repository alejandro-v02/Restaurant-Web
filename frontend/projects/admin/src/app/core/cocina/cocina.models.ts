export type EstadoPedidoItem = 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO';

export interface ItemCocina {
  itemId: string;
  pedidoId: string;
  mesaNumero: number;
  productoNombre: string;
  cantidad: number;
  notas?: string;
  estado: EstadoPedidoItem;
  creadoEn: string;
}
