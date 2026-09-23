import { EntitySchema } from 'typeorm';
import { Cliente, TipoDocumento } from '../../domain/entities/cliente.entity';

export const ClienteOrmEntity = new EntitySchema<Cliente>({
  name: 'Cliente',
  tableName: 'clientes',
  target: Cliente,
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    tipoDocumento: { type: 'enum', name: 'tipo_documento', enum: TipoDocumento },
    numeroDocumento: {
      type: 'varchar',
      name: 'numero_documento',
      length: 30,
      unique: true,
    },
    nombre: { type: 'varchar', length: 150 },
    email: { type: 'varchar', length: 150, nullable: true },
    telefono: { type: 'varchar', length: 30, nullable: true },
    direccion: { type: 'varchar', length: 250, nullable: true },
    createdAt: { type: 'timestamptz', name: 'created_at', createDate: true },
    updatedAt: { type: 'timestamptz', name: 'updated_at', updateDate: true },
  },
});
