import { Pedido } from '../entities/pedido.entity';

export const PEDIDO_REPOSITORY = Symbol('PEDIDO_REPOSITORY');

export interface PedidoRepository {
  findById(id: string): Promise<Pedido | null>;
  findByMesa(mesaId: string): Promise<Pedido[]>;
  save(pedido: Pedido): Promise<Pedido>;
}
