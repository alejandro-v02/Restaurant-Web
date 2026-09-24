import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogoAtom } from '../../atoms/logo/logo';
import { ButtonAtom } from '../../atoms/button/button';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'ui-app-shell',
  standalone: true,
  imports: [RouterOutlet, LogoAtom, ButtonAtom],
  templateUrl: './app-shell.html',
})
export class AppShellTemplate {
  private readonly authService = inject(AuthService);

  readonly usuario = this.authService.usuario;

  onLogout(): void {
    this.authService.logout();
  }
}
