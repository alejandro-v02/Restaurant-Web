import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLayoutTemplate } from '../../ui/templates/auth-layout/auth-layout';
import { LoginCredentials, LoginFormOrganism } from '../../ui/organisms/login-form/login-form';
import {
  LoginPinCredentials,
  LoginPinFormOrganism,
} from '../../ui/organisms/login-pin-form/login-pin-form';
import { AuthService } from '../../core/auth/auth.service';

type ModoLogin = 'empleado' | 'mesero';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [AuthLayoutTemplate, LoginFormOrganism, LoginPinFormOrganism],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly modo = signal<ModoLogin>('empleado');
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  onCambiarModo(modo: ModoLogin): void {
    this.modo.set(modo);
    this.errorMessage.set(null);
  }

  onSubmitEmpleado(credentials: LoginCredentials): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login(credentials.email, credentials.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.redirigirSegunRol();
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Correo o contraseña incorrectos');
      },
    });
  }

  onSubmitMesero(credentials: LoginPinCredentials): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.loginPin(credentials.codigo, credentials.pin).subscribe({
      next: () => {
        this.loading.set(false);
        this.redirigirSegunRol();
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Código o PIN incorrectos');
      },
    });
  }

  private redirigirSegunRol(): void {
    const esMesero = this.authService.usuario()?.rol === 'MESERO';
    this.router.navigateByUrl(esMesero ? '/mesero' : '/');
  }
}
