export type RolUsuario = 'ADMIN' | 'CAJERO' | 'COCINA' | 'MESERO';

export interface UsuarioSesion {
  id: string;
  nombre: string;
  rol: RolUsuario;
  email?: string;
  codigo?: string;
}

export interface SesionIniciada {
  accessToken: string;
  usuario: UsuarioSesion;
}
