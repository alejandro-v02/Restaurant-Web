import { IsIn } from 'class-validator';
import { EstadoPedidoItem } from '../../../../pedidos/domain/entities/pedido-item.entity';

const ESTADOS_QUE_MANEJA_COCINA = [
  EstadoPedidoItem.PENDIENTE,
  EstadoPedidoItem.EN_PREPARACION,
  EstadoPedidoItem.LISTO,
];

export class ActualizarEstadoItemDto {
  @IsIn(ESTADOS_QUE_MANEJA_COCINA, {
    message: 'Cocina no puede marcar un plato como entregado, eso lo hace el mesero',
  })
  estado!: EstadoPedidoItem;
}
