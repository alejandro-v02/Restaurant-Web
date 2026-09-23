import { EntitySchema } from 'typeorm';
import { Producto, TipoImpuesto } from '../../domain/entities/producto.entity';

export const ProductoOrmEntity = new EntitySchema<Producto>({
  name: 'Producto',
  tableName: 'productos',
  target: Producto,
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    categoriaId: { type: 'uuid', name: 'categoria_id' },
    nombre: { type: 'varchar', length: 150 },
    descripcion: { type: 'varchar', length: 500, nullable: true },
    precio: {
      type: 'decimal',
      precision: 12,
      scale: 2,
      transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
      },
    },
    tipoImpuesto: {
      type: 'enum',
      name: 'tipo_impuesto',
      enum: TipoImpuesto,
      default: TipoImpuesto.IVA_19,
    },
    disponible: { type: 'boolean', default: true },
    createdAt: { type: 'timestamptz', name: 'created_at', createDate: true },
    updatedAt: { type: 'timestamptz', name: 'updated_at', updateDate: true },
  },
  indices: [{ name: 'idx_producto_categoria', columns: ['categoriaId'] }],
});
