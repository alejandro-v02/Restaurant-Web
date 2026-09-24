import { Injectable, signal } from '@angular/core';

export type TipoNotificacion = 'exito' | 'error';

export interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  mensaje: string;
}

const DURACION_MS = 4000;

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private readonly _notificaciones = signal<Notificacion[]>([]);
  private contador = 0;

  readonly notificaciones = this._notificaciones.asReadonly();

  exito(mensaje: string): void {
    this.mostrar('exito', mensaje);
  }

  error(mensaje: string): void {
    this.mostrar('error', mensaje);
  }

  cerrar(id: number): void {
    this._notificaciones.update((lista) => lista.filter((notificacion) => notificacion.id !== id));
  }

  private mostrar(tipo: TipoNotificacion, mensaje: string): void {
    const id = ++this.contador;
    this._notificaciones.update((lista) => [...lista, { id, tipo, mensaje }]);
    setTimeout(() => this.cerrar(id), DURACION_MS);
  }
}
