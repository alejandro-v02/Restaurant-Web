import { PedidoItem } from '../entities/pedido-item.entity';

export const PEDIDO_ITEM_REPOSITORY = Symbol('PEDIDO_ITEM_REPOSITORY');

export interface PedidoItemRepository {
  findById(id: string): Promise<PedidoItem | null>;
  findByPedido(pedidoId: string): Promise<PedidoItem[]>;
  save(item: PedidoItem): Promise<PedidoItem>;
  delete(id: string): Promise<void>;
}
