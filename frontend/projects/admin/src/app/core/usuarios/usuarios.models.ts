export type RolUsuario = 'ADMIN' | 'CAJERO' | 'COCINA' | 'MESERO';

export const ROLES_USUARIO: { value: RolUsuario; label: string }[] = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'CAJERO', label: 'Cajero' },
  { value: 'COCINA', label: 'Cocina' },
  { value: 'MESERO', label: 'Mesero' },
];

export interface Usuario {
  id: string;
  nombre: string;
  rol: RolUsuario;
  email?: string;
  codigo?: string;
  activo: boolean;
  createdAt: string;
}
