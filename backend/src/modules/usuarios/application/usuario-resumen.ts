import { RolUsuario, Usuario } from '../domain/entities/usuario.entity';

export interface UsuarioResumen {
  id: string;
  nombre: string;
  rol: RolUsuario;
  email?: string;
  codigo?: string;
  activo: boolean;
  createdAt: Date;
}

export function aUsuarioResumen(usuario: Usuario): UsuarioResumen {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    rol: usuario.rol,
    email: usuario.email,
    codigo: usuario.codigo,
    activo: usuario.activo,
    createdAt: usuario.createdAt,
  };
}
