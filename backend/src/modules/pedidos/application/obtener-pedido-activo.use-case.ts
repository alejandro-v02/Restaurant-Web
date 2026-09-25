import { Inject, Injectable } from '@nestjs/common';
import { PEDIDO_REPOSITORY } from '../domain/ports/pedido.repository.port';
import type { PedidoRepository } from '../domain/ports/pedido.repository.port';
import { PEDIDO_ITEM_REPOSITORY } from '../domain/ports/pedido-item.repository.port';
import type { PedidoItemRepository } from '../domain/ports/pedido-item.repository.port';
import { Pedido } from '../domain/entities/pedido.entity';
import { PedidoItem } from '../domain/entities/pedido-item.entity';

export interface PedidoActivo {
  pedido: Pedido;
  items: PedidoItem[];
}

@Injectable()
export class ObtenerPedidoActivoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY) private readonly pedidoRepository: PedidoRepository,
    @Inject(PEDIDO_ITEM_REPOSITORY)
    private readonly pedidoItemRepository: PedidoItemRepository,
  ) {}

  async execute(mesaId: string): Promise<PedidoActivo | null> {
    const pedido = await this.pedidoRepository.findActivoPorMesa(mesaId);
    if (!pedido) {
      return null;
    }

    const items = await this.pedidoItemRepository.findByPedido(pedido.id);
    return { pedido, items };
  }
}
