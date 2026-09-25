import { EntitySchema } from 'typeorm';
import { Categoria } from '../../domain/entities/categoria.entity';

export const CategoriaOrmEntity = new EntitySchema<Categoria>({
  name: 'Categoria',
  tableName: 'categorias',
  target: Categoria,
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    nombre: { type: 'varchar', length: 100 },
    orden: { type: 'int', default: 0 },
    activo: { type: 'boolean', default: true },
    createdAt: { type: 'timestamptz', name: 'created_at', createDate: true },
    updatedAt: { type: 'timestamptz', name: 'updated_at', updateDate: true },
  },
});
