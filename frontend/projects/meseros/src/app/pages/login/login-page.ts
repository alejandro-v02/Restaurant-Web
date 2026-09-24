import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginPinCredentials, LoginPinFormOrganism } from '../../ui/organisms/login-pin-form/login-pin-form';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginPinFormOrganism],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  onSubmit(credentials: LoginPinCredentials): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.loginPin(credentials.codigo, credentials.pin).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Código o PIN incorrectos');
      },
    });
  }
}
