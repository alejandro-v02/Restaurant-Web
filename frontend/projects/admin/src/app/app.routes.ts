import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login-page';
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { CatalogoPage } from './pages/catalogo/catalogo-page';
import { CocinaPage } from './pages/cocina/cocina-page';
import { CajaPage } from './pages/caja/caja-page';
import { AppShellTemplate } from './ui/templates/app-shell/app-shell';
import { authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPage, canActivate: [guestGuard] },
  {
    path: '',
    component: AppShellTemplate,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardPage, data: { title: 'Dashboard' } },
      { path: 'catalogo', component: CatalogoPage, data: { title: 'Catálogo' } },
      { path: 'cocina', component: CocinaPage, data: { title: 'Cocina' } },
      { path: 'caja', component: CajaPage, data: { title: 'Caja' } },
    ],
  },
];
