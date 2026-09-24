import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SesionIniciada, UsuarioSesion } from './auth.models';

const STORAGE_KEY = 'ember-restaurant.sesion';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly sesion = signal<SesionIniciada | null>(this.leerSesionGuardada());

  readonly usuario = computed<UsuarioSesion | null>(() => this.sesion()?.usuario ?? null);
  readonly estaAutenticado = computed(() => this.sesion() !== null);

  login(email: string, password: string): Observable<SesionIniciada> {
    return this.http
      .post<SesionIniciada>(`${API_BASE_URL}/auth/login`, { email, password })
      .pipe(tap((sesion) => this.guardarSesion(sesion)));
  }

  logout(): void {
    this.sesion.set(null);
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigateByUrl('/login');
  }

  obtenerToken(): string | null {
    return this.sesion()?.accessToken ?? null;
  }

  private guardarSesion(sesion: SesionIniciada): void {
    this.sesion.set(sesion);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sesion));
  }

  private leerSesionGuardada(): SesionIniciada | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SesionIniciada) : null;
    } catch {
      return null;
    }
  }
}
