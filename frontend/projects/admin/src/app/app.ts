import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificacionesOrganism } from './ui/organisms/notificaciones/notificaciones';

@Component({
  imports: [RouterOutlet, NotificacionesOrganism],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {}
