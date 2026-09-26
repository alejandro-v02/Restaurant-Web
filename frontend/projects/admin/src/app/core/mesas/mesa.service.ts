import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Mesa } from './mesa.models';

@Injectable({ providedIn: 'root' })
export class MesaService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${API_BASE_URL}/mesas`);
  }

  tomar(id: string): Observable<Mesa> {
    return this.http.patch<Mesa>(`${API_BASE_URL}/mesas/${id}/tomar`, {});
  }

  liberar(id: string): Observable<Mesa> {
    return this.http.patch<Mesa>(`${API_BASE_URL}/mesas/${id}/liberar`, {});
  }
}
