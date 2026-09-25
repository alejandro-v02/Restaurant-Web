import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PEDIDO_REPOSITORY } from '../domain/ports/pedido.repository.port';
import type { PedidoRepository } from '../domain/ports/pedido.repository.port';
import { MESA_REPOSITORY } from '../../mesas/domain/ports/mesa.repository.port';
import type { MesaRepository } from '../../mesas/domain/ports/mesa.repository.port';
import { EstadoPedido } from '../domain/entities/pedido.entity';

@Injectable()
export class CerrarPedidoActivoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY) private readonly pedidoRepository: PedidoRepository,
    @Inject(MESA_REPOSITORY) private readonly mesaRepository: MesaRepository,
  ) {}

  async execute(mesaId: string, solicitanteId: string, esSupervisor: boolean): Promise<void> {
    const pedido = await this.pedidoRepository.findActivoPorMesa(mesaId);
    if (!pedido) {
      return;
    }

    if (!esSupervisor) {
      const mesa = await this.mesaRepository.findById(mesaId);
      if (!mesa || mesa.meseroId !== solicitanteId) {
        throw new ForbiddenException('Esta mesa no está a tu cargo');
      }
    }

    pedido.estado = EstadoPedido.CERRADO;
    await this.pedidoRepository.save(pedido);
  }
}
