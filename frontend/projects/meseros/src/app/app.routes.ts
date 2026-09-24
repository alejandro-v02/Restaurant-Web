import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login-page';
import { MesasPage } from './pages/mesas/mesas-page';
import { PedidoPage } from './pages/pedido/pedido-page';
import { authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPage, canActivate: [guestGuard] },
  { path: 'pedido/:mesaId', component: PedidoPage, canActivate: [authGuard] },
  { path: '', component: MesasPage, canActivate: [authGuard] },
];
