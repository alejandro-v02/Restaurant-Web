import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PEDIDO_REPOSITORY } from '../domain/ports/pedido.repository.port';
import type { PedidoRepository } from '../domain/ports/pedido.repository.port';
import { MESA_REPOSITORY } from '../../mesas/domain/ports/mesa.repository.port';
import type { MesaRepository } from '../../mesas/domain/ports/mesa.repository.port';
import { Pedido } from '../domain/entities/pedido.entity';

@Injectable()
export class CrearPedidoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY) private readonly pedidoRepository: PedidoRepository,
    @Inject(MESA_REPOSITORY) private readonly mesaRepository: MesaRepository,
  ) {}

  async execute(
    mesaId: string,
    solicitanteId: string,
    esSupervisor: boolean,
    personas: number,
  ): Promise<Pedido> {
    const mesa = await this.mesaRepository.findById(mesaId);
    if (!mesa) {
      throw new NotFoundException('Mesa no encontrada');
    }

    if (!esSupervisor && mesa.meseroId !== solicitanteId) {
      throw new ForbiddenException('Esta mesa no está a tu cargo');
    }

    const pedidoExistente = await this.pedidoRepository.findActivoPorMesa(mesaId);
    if (pedidoExistente) {
      return pedidoExistente;
    }

    const pedido = new Pedido({
      mesaId,
      meseroId: mesa.meseroId ?? solicitanteId,
      personas,
    });

    return this.pedidoRepository.save(pedido);
  }
}
