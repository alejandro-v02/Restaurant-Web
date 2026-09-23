export enum RolUsuario {
  ADMIN = 'ADMIN',
  CAJERO = 'CAJERO',
  COCINA = 'COCINA',
  MESERO = 'MESERO',
}

export class Usuario {
  id!: string;
  nombre!: string;
  rol!: RolUsuario;
  activo: boolean = true;
  email?: string;
  codigo?: string;
  passwordHash?: string;
  pinHash?: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial?: Partial<Usuario>) {
    if (partial) Object.assign(this, partial);
  }
}
