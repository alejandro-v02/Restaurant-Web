import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { RolUsuario, Usuario } from './usuarios.models';

export interface CrearUsuarioInput {
  nombre: string;
  rol: RolUsuario;
  email?: string;
  password?: string;
  codigo?: string;
  pin?: string;
}

export interface ActualizarUsuarioInput {
  nombre?: string;
  activo?: boolean;
  password?: string;
  pin?: string;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${API_BASE_URL}/usuarios`);
  }

  crear(input: CrearUsuarioInput): Observable<Usuario> {
    return this.http.post<Usuario>(`${API_BASE_URL}/usuarios`, input);
  }

  actualizar(id: string, input: ActualizarUsuarioInput): Observable<Usuario> {
    return this.http.patch<Usuario>(`${API_BASE_URL}/usuarios/${id}`, input);
  }
}
