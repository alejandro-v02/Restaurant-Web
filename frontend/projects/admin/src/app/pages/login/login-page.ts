import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLayoutTemplate } from '../../ui/templates/auth-layout/auth-layout';
import { LoginCredentials, LoginFormOrganism } from '../../ui/organisms/login-form/login-form';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [AuthLayoutTemplate, LoginFormOrganism],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  onSubmit(credentials: LoginCredentials): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login(credentials.email, credentials.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Correo o contraseña incorrectos');
      },
    });
  }
}
