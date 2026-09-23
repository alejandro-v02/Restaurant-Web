import { EntitySchema } from 'typeorm';
import { Pago, MetodoPago } from '../../domain/entities/pago.entity';

const moneyTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

export const PagoOrmEntity = new EntitySchema<Pago>({
  name: 'Pago',
  tableName: 'pagos',
  target: Pago,
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    pedidoId: { type: 'uuid', name: 'pedido_id' },
    turnoId: { type: 'uuid', name: 'turno_id' },
    metodo: { type: 'enum', enum: MetodoPago },
    monto: {
      type: 'decimal',
      precision: 12,
      scale: 2,
      transformer: moneyTransformer,
    },
    propina: {
      type: 'decimal',
      precision: 12,
      scale: 2,
      default: 0,
      transformer: moneyTransformer,
    },
    createdAt: { type: 'timestamptz', name: 'created_at', createDate: true },
  },
  indices: [{ name: 'idx_pago_turno', columns: ['turnoId'] }],
});
