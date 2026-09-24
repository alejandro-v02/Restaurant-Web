import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  templateUrl: './dashboard-page.html',
})
export class DashboardPage {
  private readonly authService = inject(AuthService);

  readonly usuario = this.authService.usuario;
}
