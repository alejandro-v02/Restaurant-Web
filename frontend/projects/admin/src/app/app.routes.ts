import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login-page';
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { AppShellTemplate } from './ui/templates/app-shell/app-shell';
import { authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPage, canActivate: [guestGuard] },
  {
    path: '',
    component: AppShellTemplate,
    canActivate: [authGuard],
    children: [{ path: '', component: DashboardPage }],
  },
];
