import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Categoria, Producto, TipoImpuesto } from './catalogo.models';

export interface CrearCategoriaInput {
  nombre: string;
}

export interface CrearProductoInput {
  categoriaId: string;
  nombre: string;
  precio: number;
  tipoImpuesto: TipoImpuesto;
  enviarACocina?: boolean;
}

export interface ActualizarProductoInput {
  categoriaId?: string;
  nombre?: string;
  precio?: number;
  tipoImpuesto?: TipoImpuesto;
  disponible?: boolean;
  enviarACocina?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly http = inject(HttpClient);

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${API_BASE_URL}/categorias`);
  }

  crearCategoria(input: CrearCategoriaInput): Observable<Categoria> {
    return this.http.post<Categoria>(`${API_BASE_URL}/categorias`, input);
  }

  eliminarCategoria(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/categorias/${id}`);
  }

  listarProductos(categoriaId?: string): Observable<Producto[]> {
    const params = categoriaId ? new HttpParams().set('categoriaId', categoriaId) : undefined;
    return this.http.get<Producto[]>(`${API_BASE_URL}/productos`, { params });
  }

  crearProducto(input: CrearProductoInput): Observable<Producto> {
    return this.http.post<Producto>(`${API_BASE_URL}/productos`, input);
  }

  actualizarProducto(id: string, input: ActualizarProductoInput): Observable<Producto> {
    return this.http.patch<Producto>(`${API_BASE_URL}/productos/${id}`, input);
  }

  eliminarProducto(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/productos/${id}`);
  }
}
