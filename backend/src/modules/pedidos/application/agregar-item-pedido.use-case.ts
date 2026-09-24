import {
  BadRequestException,
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
import { PRODUCTO_REPOSITORY } from '../../catalogo/domain/ports/producto.repository.port';
import type { ProductoRepository } from '../../catalogo/domain/ports/producto.repository.port';
import { EstadoPedido } from '../domain/entities/pedido.entity';
import { PedidoItem } from '../domain/entities/pedido-item.entity';

export interface AgregarItemPedidoInput {
  productoId: string;
  cantidad: number;
  notas?: string;
}

@Injectable()
export class AgregarItemPedidoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY) private readonly pedidoRepository: PedidoRepository,
    @Inject(PEDIDO_ITEM_REPOSITORY)
    private readonly pedidoItemRepository: PedidoItemRepository,
    @Inject(MESA_REPOSITORY) private readonly mesaRepository: MesaRepository,
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepository,
  ) {}

  async execute(
    pedidoId: string,
    solicitanteId: string,
    esSupervisor: boolean,
    input: AgregarItemPedidoInput,
  ): Promise<PedidoItem> {
    const pedido = await this.pedidoRepository.findById(pedidoId);
    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    if (pedido.estado === EstadoPedido.CERRADO || pedido.estado === EstadoPedido.CANCELADO) {
      throw new ConflictException('El pedido ya está cerrado');
    }

    if (!esSupervisor) {
      const mesa = await this.mesaRepository.findById(pedido.mesaId);
      if (!mesa || mesa.meseroId !== solicitanteId) {
        throw new ForbiddenException('Esta mesa no está a tu cargo');
      }
    }

    const producto = await this.productoRepository.findById(input.productoId);
    if (!producto || !producto.disponible) {
      throw new BadRequestException('El producto no existe o no está disponible');
    }

    const item = new PedidoItem({
      pedidoId,
      productoId: producto.id,
      cantidad: input.cantidad,
      precioUnitario: producto.precio,
      notas: input.notas,
    });

    return this.pedidoItemRepository.save(item);
  }
}
