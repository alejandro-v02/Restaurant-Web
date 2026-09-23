import { EntitySchema } from 'typeorm';
import { ResolucionNumeracion } from '../../domain/entities/resolucion-numeracion.entity';
import { TipoDocumentoElectronico } from '../../domain/entities/documento-electronico.entity';

export const ResolucionNumeracionOrmEntity = new EntitySchema<ResolucionNumeracion>({
  name: 'ResolucionNumeracion',
  tableName: 'resoluciones_numeracion',
  target: ResolucionNumeracion,
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    tipoDocumento: {
      type: 'enum',
      name: 'tipo_documento',
      enum: TipoDocumentoElectronico,
    },
    prefijo: { type: 'varchar', length: 10 },
    rangoDesde: { type: 'bigint', name: 'rango_desde' },
    rangoHasta: { type: 'bigint', name: 'rango_hasta' },
    consecutivoActual: { type: 'bigint', name: 'consecutivo_actual' },
    fechaVencimiento: { type: 'date', name: 'fecha_vencimiento' },
    activo: { type: 'boolean', default: true },
  },
});
