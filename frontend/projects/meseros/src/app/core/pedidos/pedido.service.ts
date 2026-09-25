import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Pedido, PedidoActivo, PedidoItem } from './pedido.models';

export interface AgregarItemInput {
  productoId: string;
  cantidad: number;
  notas?: string;
}

export interface ActualizarItemInput {
  cantidad?: number;
  notas?: string;
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly http = inject(HttpClient);

  obtenerPorMesa(mesaId: string): Observable<PedidoActivo | null> {
    return this.http.get<PedidoActivo | null>(`${API_BASE_URL}/pedidos/mesa/${mesaId}`);
  }

  crear(mesaId: string, personas: number): Observable<Pedido> {
    return this.http.post<Pedido>(`${API_BASE_URL}/pedidos`, { mesaId, personas });
  }

  agregarItem(pedidoId: string, input: AgregarItemInput): Observable<PedidoItem> {
    return this.http.post<PedidoItem>(`${API_BASE_URL}/pedidos/${pedidoId}/items`, input);
  }

  actualizarItem(itemId: string, input: ActualizarItemInput): Observable<PedidoItem> {
    return this.http.patch<PedidoItem>(`${API_BASE_URL}/pedidos/items/${itemId}`, input);
  }

  eliminarItem(itemId: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/pedidos/items/${itemId}`);
  }

  entregarItem(itemId: string): Observable<PedidoItem> {
    return this.http.patch<PedidoItem>(`${API_BASE_URL}/pedidos/items/${itemId}/entregar`, {});
  }

  enviar(pedidoId: string): Observable<Pedido> {
    return this.http.patch<Pedido>(`${API_BASE_URL}/pedidos/${pedidoId}/enviar`, {});
  }

  cerrarPedidoActivo(mesaId: string): Observable<void> {
    return this.http.patch<void>(`${API_BASE_URL}/pedidos/mesa/${mesaId}/cerrar`, {});
  }
}
