import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PEDIDO_ITEM_REPOSITORY } from '../../pedidos/domain/ports/pedido-item.repository.port';
import type { PedidoItemRepository } from '../../pedidos/domain/ports/pedido-item.repository.port';
import { EstadoPedidoItem, PedidoItem } from '../../pedidos/domain/entities/pedido-item.entity';

@Injectable()
export class ActualizarEstadoItemCocinaUseCase {
  constructor(
    @Inject(PEDIDO_ITEM_REPOSITORY)
    private readonly pedidoItemRepository: PedidoItemRepository,
  ) {}

  async execute(itemId: string, nuevoEstado: EstadoPedidoItem): Promise<PedidoItem> {
    const item = await this.pedidoItemRepository.findById(itemId);
    if (!item) {
      throw new NotFoundException('Ítem no encontrado');
    }

    item.estado = nuevoEstado;
    await this.pedidoItemRepository.save(item);

    return (await this.pedidoItemRepository.findById(itemId))!;
  }
}
