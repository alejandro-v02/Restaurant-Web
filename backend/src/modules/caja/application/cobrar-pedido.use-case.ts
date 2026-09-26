import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PEDIDO_REPOSITORY } from '../../pedidos/domain/ports/pedido.repository.port';
import type { PedidoRepository } from '../../pedidos/domain/ports/pedido.repository.port';
import { PEDIDO_ITEM_REPOSITORY } from '../../pedidos/domain/ports/pedido-item.repository.port';
import type { PedidoItemRepository } from '../../pedidos/domain/ports/pedido-item.repository.port';
import { MESA_REPOSITORY } from '../../mesas/domain/ports/mesa.repository.port';
import type { MesaRepository } from '../../mesas/domain/ports/mesa.repository.port';
import { TURNO_REPOSITORY } from '../domain/ports/turno.repository.port';
import type { TurnoRepository } from '../domain/ports/turno.repository.port';
import { PAGO_REPOSITORY } from '../domain/ports/pago.repository.port';
import type { PagoRepository } from '../domain/ports/pago.repository.port';
import { EstadoPedido } from '../../pedidos/domain/entities/pedido.entity';
import { EstadoMesa } from '../../mesas/domain/entities/mesa.entity';
import { Pago, MetodoPago } from '../domain/entities/pago.entity';

export interface CobrarPedidoInput {
  metodo: MetodoPago;
  propina?: number;
}

@Injectable()
export class CobrarPedidoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY) private readonly pedidoRepository: PedidoRepository,
    @Inject(PEDIDO_ITEM_REPOSITORY)
    private readonly pedidoItemRepository: PedidoItemRepository,
    @Inject(MESA_REPOSITORY) private readonly mesaRepository: MesaRepository,
    @Inject(TURNO_REPOSITORY) private readonly turnoRepository: TurnoRepository,
    @Inject(PAGO_REPOSITORY) private readonly pagoRepository: PagoRepository,
  ) {}

  async execute(pedidoId: string, cajeroId: string, input: CobrarPedidoInput): Promise<Pago> {
    const turno = await this.turnoRepository.findAbiertoPorCajero(cajeroId);
    if (!turno) {
      throw new ConflictException('Tenés que abrir un turno de caja antes de cobrar');
    }

    const pedido = await this.pedidoRepository.findById(pedidoId);
    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }
    if (pedido.estado !== EstadoPedido.SERVIDO) {
      throw new ConflictException('Ese pedido todavía no está listo para cobrar');
    }

    const items = await this.pedidoItemRepository.findByPedido(pedidoId);
    const total = items.reduce((suma, item) => suma + item.cantidad * item.precioUnitario, 0);

    const pago = await this.pagoRepository.save(
      new Pago({
        pedidoId,
        turnoId: turno.id,
        metodo: input.metodo,
        monto: total,
        propina: input.propina ?? 0,
      }),
    );

    pedido.estado = EstadoPedido.CERRADO;
    await this.pedidoRepository.save(pedido);

    const mesa = await this.mesaRepository.findById(pedido.mesaId);
    if (mesa) {
      mesa.meseroId = null;
      mesa.estado = EstadoMesa.LIBRE;
      await this.mesaRepository.save(mesa);
    }

    return pago;
  }
}
