import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Categoria, Producto } from './catalogo.models';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly http = inject(HttpClient);

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${API_BASE_URL}/categorias`);
  }

  listarProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${API_BASE_URL}/productos`);
  }
}
