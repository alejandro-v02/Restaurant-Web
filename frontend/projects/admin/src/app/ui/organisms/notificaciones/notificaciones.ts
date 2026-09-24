import { Component, inject } from '@angular/core';
import { NotificacionService } from '../../../core/notificaciones/notificacion.service';

@Component({
  selector: 'ui-notificaciones',
  standalone: true,
  templateUrl: './notificaciones.html',
})
export class NotificacionesOrganism {
  private readonly notificacionService = inject(NotificacionService);

  readonly notificaciones = this.notificacionService.notificaciones;

  cerrar(id: number): void {
    this.notificacionService.cerrar(id);
  }
}
