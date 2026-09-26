import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login-page';
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { CatalogoPage } from './pages/catalogo/catalogo-page';
import { CocinaPage } from './pages/cocina/cocina-page';
import { CajaPage } from './pages/caja/caja-page';
import { MesasPage } from './pages/mesero/mesas/mesas-page';
import { PedidoPage } from './pages/mesero/pedido/pedido-page';
import { AppShellTemplate } from './ui/templates/app-shell/app-shell';
import { authGuard, guestGuard, meseroGuard, noMeseroGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPage, canActivate: [guestGuard] },
  {
    path: 'mesero',
    canActivate: [authGuard, meseroGuard],
    children: [
      { path: '', component: MesasPage },
      { path: 'pedido/:mesaId', component: PedidoPage },
    ],
  },
  {
    path: '',
    component: AppShellTemplate,
    canActivate: [authGuard, noMeseroGuard],
    children: [
      { path: '', component: DashboardPage, data: { title: 'Dashboard' } },
      { path: 'catalogo', component: CatalogoPage, data: { title: 'Catálogo' } },
      { path: 'cocina', component: CocinaPage, data: { title: 'Cocina' } },
      { path: 'caja', component: CajaPage, data: { title: 'Caja' } },
    ],
  },
];
