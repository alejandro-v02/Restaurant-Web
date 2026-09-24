import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { EstadoPedidoItem, ItemCocina } from './cocina.models';

@Injectable({ providedIn: 'root' })
export class CocinaService {
  private readonly http = inject(HttpClient);

  listarItems(): Observable<ItemCocina[]> {
    return this.http.get<ItemCocina[]>(`${API_BASE_URL}/cocina/items`);
  }

  actualizarEstado(itemId: string, estado: EstadoPedidoItem): Observable<unknown> {
    return this.http.patch(`${API_BASE_URL}/cocina/items/${itemId}/estado`, { estado });
  }
}
