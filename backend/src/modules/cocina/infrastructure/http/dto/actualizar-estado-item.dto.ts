import { IsEnum } from 'class-validator';
import { EstadoPedidoItem } from '../../../../pedidos/domain/entities/pedido-item.entity';

export class ActualizarEstadoItemDto {
  @IsEnum(EstadoPedidoItem)
  estado!: EstadoPedidoItem;
}
