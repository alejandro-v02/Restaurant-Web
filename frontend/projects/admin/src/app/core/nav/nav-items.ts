import { RolUsuario } from '../auth/auth.models';

export interface NavItem {
  label: string;
  path: string;
  roles: RolUsuario[];
  enabled: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', roles: ['ADMIN', 'CAJERO', 'COCINA'], enabled: true },
  { label: 'Catálogo', path: '/catalogo', roles: ['ADMIN'], enabled: false },
  { label: 'Mesas', path: '/mesas', roles: ['ADMIN', 'CAJERO'], enabled: false },
  { label: 'Usuarios', path: '/usuarios', roles: ['ADMIN'], enabled: false },
  { label: 'Pedidos', path: '/pedidos', roles: ['CAJERO'], enabled: false },
  { label: 'Cocina', path: '/cocina', roles: ['COCINA'], enabled: false },
  { label: 'Caja', path: '/caja', roles: ['CAJERO'], enabled: false },
  { label: 'Facturación', path: '/facturacion', roles: ['ADMIN', 'CAJERO'], enabled: false },
  { label: 'Reportes', path: '/reportes', roles: ['ADMIN'], enabled: false },
];
