import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PEDIDO_REPOSITORY } from '../domain/ports/pedido.repository.port';
import type { PedidoRepository } from '../domain/ports/pedido.repository.port';
import { PEDIDO_ITEM_REPOSITORY } from '../domain/ports/pedido-item.repository.port';
import type { PedidoItemRepository } from '../domain/ports/pedido-item.repository.port';
import { MESA_REPOSITORY } from '../../mesas/domain/ports/mesa.repository.port';
import type { MesaRepository } from '../../mesas/domain/ports/mesa.repository.port';
import { EstadoPedidoItem, PedidoItem } from '../domain/entities/pedido-item.entity';

@Injectable()
export class MarcarItemEntregadoUseCase {
  constructor(
    @Inject(PEDIDO_ITEM_REPOSITORY)
    private readonly pedidoItemRepository: PedidoItemRepository,
    @Inject(PEDIDO_REPOSITORY) private readonly pedidoRepository: PedidoRepository,
    @Inject(MESA_REPOSITORY) private readonly mesaRepository: MesaRepository,
  ) {}

  async execute(
    itemId: string,
    solicitanteId: string,
    esSupervisor: boolean,
  ): Promise<PedidoItem> {
    const item = await this.pedidoItemRepository.findById(itemId);
    if (!item) {
      throw new NotFoundException('Ítem no encontrado');
    }

    if (item.estado === EstadoPedidoItem.ENTREGADO) {
      throw new ConflictException('Ese plato ya fue marcado como entregado');
    }

    if (!esSupervisor) {
      const pedido = await this.pedidoRepository.findById(item.pedidoId);
      const mesa = pedido ? await this.mesaRepository.findById(pedido.mesaId) : null;
      if (!mesa || mesa.meseroId !== solicitanteId) {
        throw new ForbiddenException('Esta mesa no está a tu cargo');
      }
    }

    item.estado = EstadoPedidoItem.ENTREGADO;
    await this.pedidoItemRepository.save(item);

    return (await this.pedidoItemRepository.findById(itemId))!;
  }
}
