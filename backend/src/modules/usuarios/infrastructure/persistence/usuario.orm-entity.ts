import { EntitySchema } from 'typeorm';
import { Usuario, RolUsuario } from '../../domain/entities/usuario.entity';

export const UsuarioOrmEntity = new EntitySchema<Usuario>({
  name: 'Usuario',
  tableName: 'usuarios',
  target: Usuario,
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    nombre: { type: 'varchar', length: 150 },
    email: { type: 'varchar', length: 150, nullable: true, unique: true },
    codigo: { type: 'varchar', length: 30, nullable: true, unique: true },
    passwordHash: { type: 'varchar', name: 'password_hash', nullable: true },
    pinHash: { type: 'varchar', name: 'pin_hash', nullable: true },
    rol: { type: 'enum', enum: RolUsuario },
    activo: { type: 'boolean', default: true },
    createdAt: { type: 'timestamptz', name: 'created_at', createDate: true },
    updatedAt: { type: 'timestamptz', name: 'updated_at', updateDate: true },
  },
});
