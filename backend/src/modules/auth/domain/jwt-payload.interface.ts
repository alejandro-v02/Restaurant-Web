import { RolUsuario } from '../../usuarios/domain/entities/usuario.entity';

export interface JwtPayload {
  sub: string;
  nombre: string;
  rol: RolUsuario;
}
