import { EntitySchema } from 'typeorm';
import { Turno, EstadoTurno } from '../../domain/entities/turno.entity';

const moneyTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

export const TurnoOrmEntity = new EntitySchema<Turno>({
  name: 'Turno',
  tableName: 'turnos',
  target: Turno,
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    cajeroId: { type: 'uuid', name: 'cajero_id' },
    fechaApertura: { type: 'timestamptz', name: 'fecha_apertura' },
    fechaCierre: { type: 'timestamptz', name: 'fecha_cierre', nullable: true },
    montoApertura: {
      type: 'decimal',
      name: 'monto_apertura',
      precision: 12,
      scale: 2,
      transformer: moneyTransformer,
    },
    montoCierre: {
      type: 'decimal',
      name: 'monto_cierre',
      precision: 12,
      scale: 2,
      nullable: true,
      transformer: moneyTransformer,
    },
    estado: { type: 'enum', enum: EstadoTurno, default: EstadoTurno.ABIERTO },
  },
});
