import { EntitySchema } from 'typeorm';
import { Pedido, EstadoPedido } from '../../domain/entities/pedido.entity';

export const PedidoOrmEntity = new EntitySchema<Pedido>({
  name: 'Pedido',
  tableName: 'pedidos',
  target: Pedido,
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    mesaId: { type: 'uuid', name: 'mesa_id' },
    meseroId: { type: 'uuid', name: 'mesero_id' },
    clienteId: { type: 'uuid', name: 'cliente_id', nullable: true },
    estado: { type: 'enum', enum: EstadoPedido, default: EstadoPedido.ABIERTO },
    createdAt: { type: 'timestamptz', name: 'created_at', createDate: true },
    updatedAt: { type: 'timestamptz', name: 'updated_at', updateDate: true },
  },
  indices: [{ name: 'idx_pedido_mesa', columns: ['mesaId'] }],
});
