import { Usuario } from '../entities/usuario.entity';

export const USUARIO_REPOSITORY = Symbol('USUARIO_REPOSITORY');

export interface UsuarioRepository {
  findById(id: string): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  findByCodigo(codigo: string): Promise<Usuario | null>;
  findAll(): Promise<Usuario[]>;
  findByRol(rol: Usuario['rol']): Promise<Usuario[]>;
  save(usuario: Usuario): Promise<Usuario>;
}
