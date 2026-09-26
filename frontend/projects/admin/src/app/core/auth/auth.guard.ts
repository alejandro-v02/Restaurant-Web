import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

function rutaInicial(authService: AuthService): string {
  return authService.usuario()?.rol === 'MESERO' ? '/mesero' : '/';
}

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.estaAutenticado() ? true : router.parseUrl('/login');
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.estaAutenticado() ? router.parseUrl(rutaInicial(authService)) : true;
};

export const meseroGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.usuario()?.rol === 'MESERO' ? true : router.parseUrl('/');
};

export const noMeseroGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.usuario()?.rol !== 'MESERO' ? true : router.parseUrl('/mesero');
};
