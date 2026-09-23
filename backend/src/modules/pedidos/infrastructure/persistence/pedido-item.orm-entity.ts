import { EntitySchema } from 'typeorm';
import {
  PedidoItem,
  EstadoPedidoItem,
} from '../../domain/entities/pedido-item.entity';

const moneyTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

export const PedidoItemOrmEntity = new EntitySchema<PedidoItem>({
  name: 'PedidoItem',
  tableName: 'pedido_items',
  target: PedidoItem,
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    pedidoId: { type: 'uuid', name: 'pedido_id' },
    productoId: { type: 'uuid', name: 'producto_id' },
    cantidad: { type: 'int' },
    precioUnitario: {
      type: 'decimal',
      name: 'precio_unitario',
      precision: 12,
      scale: 2,
      transformer: moneyTransformer,
    },
    notas: { type: 'varchar', length: 300, nullable: true },
    estado: {
      type: 'enum',
      enum: EstadoPedidoItem,
      default: EstadoPedidoItem.PENDIENTE,
    },
    createdAt: { type: 'timestamptz', name: 'created_at', createDate: true },
    updatedAt: { type: 'timestamptz', name: 'updated_at', updateDate: true },
  },
  indices: [{ name: 'idx_pedido_item_pedido', columns: ['pedidoId'] }],
});
