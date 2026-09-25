import { Inject, Injectable } from '@nestjs/common';
import { PEDIDO_REPOSITORY } from '../../pedidos/domain/ports/pedido.repository.port';
import type { PedidoRepository } from '../../pedidos/domain/ports/pedido.repository.port';
import { PEDIDO_ITEM_REPOSITORY } from '../../pedidos/domain/ports/pedido-item.repository.port';
import type { PedidoItemRepository } from '../../pedidos/domain/ports/pedido-item.repository.port';
import { MESA_REPOSITORY } from '../../mesas/domain/ports/mesa.repository.port';
import type { MesaRepository } from '../../mesas/domain/ports/mesa.repository.port';
import { PRODUCTO_REPOSITORY } from '../../catalogo/domain/ports/producto.repository.port';
import type { ProductoRepository } from '../../catalogo/domain/ports/producto.repository.port';
import { CATEGORIA_REPOSITORY } from '../../catalogo/domain/ports/categoria.repository.port';
import type { CategoriaRepository } from '../../catalogo/domain/ports/categoria.repository.port';
import { USUARIO_REPOSITORY } from '../../usuarios/domain/ports/usuario.repository.port';
import type { UsuarioRepository } from '../../usuarios/domain/ports/usuario.repository.port';
import { EstadoPedido } from '../../pedidos/domain/entities/pedido.entity';
import { EstadoPedidoItem } from '../../pedidos/domain/entities/pedido-item.entity';

export interface ItemCocina {
  itemId: string;
  pedidoId: string;
  mesaNumero: number;
  meseroNombre: string;
  productoNombre: string;
  cantidad: number;
  notas?: string;
  estado: EstadoPedidoItem;
  creadoEn: Date;
}

@Injectable()
export class ListarItemsCocinaUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY) private readonly pedidoRepository: PedidoRepository,
    @Inject(PEDIDO_ITEM_REPOSITORY)
    private readonly pedidoItemRepository: PedidoItemRepository,
    @Inject(MESA_REPOSITORY) private readonly mesaRepository: MesaRepository,
    @Inject(PRODUCTO_REPOSITORY) private readonly productoRepository: ProductoRepository,
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepository,
    @Inject(USUARIO_REPOSITORY) private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async execute(): Promise<ItemCocina[]> {
    const [pedidos, productos, categorias, mesas, usuarios] = await Promise.all([
      this.pedidoRepository.findByEstados([EstadoPedido.ENVIADO_COCINA]),
      this.productoRepository.findAll(),
      this.categoriaRepository.findAll(),
      this.mesaRepository.findAll(),
      this.usuarioRepository.findAll(),
    ]);

    const categoriasDeCocina = new Set(
      categorias.filter((categoria) => categoria.enviarACocina).map((categoria) => categoria.id),
    );
    const productosDeCocina = new Map(
      productos
        .filter((producto) => categoriasDeCocina.has(producto.categoriaId))
        .map((producto) => [producto.id, producto]),
    );
    const mesasPorId = new Map(mesas.map((mesa) => [mesa.id, mesa]));
    const usuariosPorId = new Map(usuarios.map((usuario) => [usuario.id, usuario]));

    const resultado: ItemCocina[] = [];

    for (const pedido of pedidos) {
      const items = await this.pedidoItemRepository.findByPedido(pedido.id);
      const mesa = mesasPorId.get(pedido.mesaId);
      const mesero = usuariosPorId.get(pedido.meseroId);

      for (const item of items) {
        if (item.estado === EstadoPedidoItem.ENTREGADO) {
          continue;
        }
        const producto = productosDeCocina.get(item.productoId);
        if (!producto) {
          continue;
        }

        resultado.push({
          itemId: item.id,
          pedidoId: pedido.id,
          mesaNumero: mesa?.numero ?? 0,
          meseroNombre: mesero?.nombre ?? '—',
          productoNombre: producto.nombre,
          cantidad: item.cantidad,
          notas: item.notas,
          estado: item.estado,
          creadoEn: item.createdAt,
        });
      }
    }

    resultado.sort((a, b) => a.creadoEn.getTime() - b.creadoEn.getTime());
    return resultado;
  }
}
