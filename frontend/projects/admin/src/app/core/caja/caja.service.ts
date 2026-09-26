import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { MetodoPago, PedidoCaja, Turno } from './caja.models';

export interface CobrarInput {
  metodo: MetodoPago;
  propina?: number;
}

@Injectable({ providedIn: 'root' })
export class CajaService {
  private readonly http = inject(HttpClient);

  turnoActivo(): Observable<Turno | null> {
    return this.http.get<Turno | null>(`${API_BASE_URL}/caja/turno/activo`);
  }

  abrirTurno(montoApertura: number): Observable<Turno> {
    return this.http.post<Turno>(`${API_BASE_URL}/caja/turno/abrir`, { montoApertura });
  }

  cerrarTurno(turnoId: string, montoCierre: number): Observable<Turno> {
    return this.http.patch<Turno>(`${API_BASE_URL}/caja/turno/${turnoId}/cerrar`, {
      montoCierre,
    });
  }

  listarPedidos(): Observable<PedidoCaja[]> {
    return this.http.get<PedidoCaja[]>(`${API_BASE_URL}/caja/pedidos`);
  }

  cobrar(pedidoId: string, input: CobrarInput): Observable<unknown> {
    return this.http.patch(`${API_BASE_URL}/caja/pedidos/${pedidoId}/cobrar`, input);
  }
}
