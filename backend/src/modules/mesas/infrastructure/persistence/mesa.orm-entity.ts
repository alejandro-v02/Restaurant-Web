import { EntitySchema } from 'typeorm';
import { Mesa, EstadoMesa } from '../../domain/entities/mesa.entity';

export const MesaOrmEntity = new EntitySchema<Mesa>({
  name: 'Mesa',
  tableName: 'mesas',
  target: Mesa,
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    numero: { type: 'int', unique: true },
    capacidad: { type: 'int' },
    estado: { type: 'enum', enum: EstadoMesa, default: EstadoMesa.LIBRE },
    meseroId: { type: 'uuid', name: 'mesero_id', nullable: true },
    createdAt: { type: 'timestamptz', name: 'created_at', createDate: true },
    updatedAt: { type: 'timestamptz', name: 'updated_at', updateDate: true },
  },
});
