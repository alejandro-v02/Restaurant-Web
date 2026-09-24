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
  precio: number;
  disponible: boolean;
}
