import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PEDIDO_REPOSITORY } from '../domain/ports/pedido.repository.port';
import type { PedidoRepository } from '../domain/ports/pedido.repository.port';
import { MESA_REPOSITORY } from '../../mesas/domain/ports/mesa.repository.port';
import type { MesaRepository } from '../../mesas/domain/ports/mesa.repository.port';
import { EstadoPedido, Pedido } from '../domain/entities/pedido.entity';

@Injectable()
export class EnviarPedidoCocinaUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY) private readonly pedidoRepository: PedidoRepository,
    @Inject(MESA_REPOSITORY) private readonly mesaRepository: MesaRepository,
  ) {}

  async execute(pedidoId: string, solicitanteId: string, esSupervisor: boolean): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findById(pedidoId);
    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    if (!esSupervisor) {
      const mesa = await this.mesaRepository.findById(pedido.mesaId);
      if (!mesa || mesa.meseroId !== solicitanteId) {
        throw new ForbiddenException('Esta mesa no está a tu cargo');
      }
    }

    if (pedido.estado === EstadoPedido.ABIERTO) {
      pedido.estado = EstadoPedido.ENVIADO_COCINA;
      await this.pedidoRepository.save(pedido);
    }

    return (await this.pedidoRepository.findById(pedidoId))!;
  }
}
