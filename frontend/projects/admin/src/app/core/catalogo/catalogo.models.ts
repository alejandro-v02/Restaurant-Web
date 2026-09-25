export type TipoImpuesto = 'IVA_19' | 'INC_8' | 'EXCLUIDO';

export const TIPOS_IMPUESTO: { value: TipoImpuesto; label: string }[] = [
  { value: 'EXCLUIDO', label: 'Excluido' },
  { value: 'IVA_19', label: 'IVA 19%' },
  { value: 'INC_8', label: 'INC 8%' },
];

export interface Categoria {
  id: string;
  nombre: string;
  orden: number;
  activo: boolean;
}

export interface Producto {
  id: string;
  categoriaId: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  tipoImpuesto: TipoImpuesto;
  disponible: boolean;
  enviarACocina: boolean;
}
