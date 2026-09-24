import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { LogoAtom } from '../../atoms/logo/logo';
import { ButtonAtom } from '../../atoms/button/button';
import { AuthService } from '../../../core/auth/auth.service';
import { NAV_ITEMS } from '../../../core/nav/nav-items';

@Component({
  selector: 'ui-app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LogoAtom, ButtonAtom],
  templateUrl: './app-shell.html',
})
export class AppShellTemplate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly usuario = this.authService.usuario;

  readonly navItems = computed(() => {
    const rol = this.usuario()?.rol;
    return NAV_ITEMS.filter((item) => !rol || item.roles.includes(rol));
  });

  readonly pageTitle = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.obtenerTituloActual()),
      startWith(this.obtenerTituloActual()),
    ),
    { initialValue: '' },
  );

  onLogout(): void {
    this.authService.logout();
  }

  private obtenerTituloActual(): string {
    let route = this.activatedRoute.firstChild;
    while (route?.firstChild) {
      route = route.firstChild;
    }
    return route?.snapshot.data['title'] ?? '';
  }
}
