import { Inject, Injectable } from '@nestjs/common';
import { PEDIDO_REPOSITORY } from '../../pedidos/domain/ports/pedido.repository.port';
import type { PedidoRepository } from '../../pedidos/domain/ports/pedido.repository.port';
import { PEDIDO_ITEM_REPOSITORY } from '../../pedidos/domain/ports/pedido-item.repository.port';
import type { PedidoItemRepository } from '../../pedidos/domain/ports/pedido-item.repository.port';
import { MESA_REPOSITORY } from '../../mesas/domain/ports/mesa.repository.port';
import type { MesaRepository } from '../../mesas/domain/ports/mesa.repository.port';
import { PRODUCTO_REPOSITORY } from '../../catalogo/domain/ports/producto.repository.port';
import type { ProductoRepository } from '../../catalogo/domain/ports/producto.repository.port';
import { USUARIO_REPOSITORY } from '../../usuarios/domain/ports/usuario.repository.port';
import type { UsuarioRepository } from '../../usuarios/domain/ports/usuario.repository.port';
import { EstadoPedido } from '../../pedidos/domain/entities/pedido.entity';

export interface ItemCaja {
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
}

export interface PedidoCaja {
  pedidoId: string;
  mesaNumero: number;
  meseroNombre: string;
  personas: number;
  items: ItemCaja[];
  total: number;
  actualizadoEn: Date;
}

@Injectable()
export class ListarPedidosServidosUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY) private readonly pedidoRepository: PedidoRepository,
    @Inject(PEDIDO_ITEM_REPOSITORY)
    private readonly pedidoItemRepository: PedidoItemRepository,
    @Inject(MESA_REPOSITORY) private readonly mesaRepository: MesaRepository,
    @Inject(PRODUCTO_REPOSITORY) private readonly productoRepository: ProductoRepository,
    @Inject(USUARIO_REPOSITORY) private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async execute(): Promise<PedidoCaja[]> {
    const [pedidos, mesas, productos, usuarios] = await Promise.all([
      this.pedidoRepository.findByEstados([EstadoPedido.SERVIDO]),
      this.mesaRepository.findAll(),
      this.productoRepository.findAll(),
      this.usuarioRepository.findAll(),
    ]);

    const mesasPorId = new Map(mesas.map((mesa) => [mesa.id, mesa]));
    const productosPorId = new Map(productos.map((producto) => [producto.id, producto]));
    const usuariosPorId = new Map(usuarios.map((usuario) => [usuario.id, usuario]));

    const resultado: PedidoCaja[] = [];

    for (const pedido of pedidos) {
      const items = await this.pedidoItemRepository.findByPedido(pedido.id);
      const mesa = mesasPorId.get(pedido.mesaId);
      const mesero = usuariosPorId.get(pedido.meseroId);

      resultado.push({
        pedidoId: pedido.id,
        mesaNumero: mesa?.numero ?? 0,
        meseroNombre: mesero?.nombre ?? '—',
        personas: pedido.personas,
        items: items.map((item) => ({
          productoNombre: productosPorId.get(item.productoId)?.nombre ?? '—',
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
        })),
        total: items.reduce((suma, item) => suma + item.cantidad * item.precioUnitario, 0),
        actualizadoEn: pedido.updatedAt,
      });
    }

    resultado.sort((a, b) => a.actualizadoEn.getTime() - b.actualizadoEn.getTime());
    return resultado;
  }
}
