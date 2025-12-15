import { Routes } from '@angular/router';
import { LoginDeveloper } from './pages/login-developer/login-developer';
import { LogsUsers } from './pages/logs-users/logs-users';
import { Logs } from './pages/logs/logs';
import { Tenants } from './pages/tenants/tenants';
import { AuthGuard } from './guards/auth.guard';
import { Plans } from './pages/plans/plans';
import { Configuration } from './pages/configuration-tenant/configuration-tenant';

export const routes: Routes = [
  { path: 'login-developer', component: LoginDeveloper },
  { path: 'logs-users', component: LogsUsers, canActivate: [AuthGuard] },
  { path: 'logs', component: Logs, canActivate: [AuthGuard] },
  { path: 'tenants', component: Tenants, canActivate: [AuthGuard] },
  { path: 'plans', component: Plans, canActivate: [AuthGuard] },
  {path:'configuration',component:Configuration,canActivate:[AuthGuard]},
  { path: '', redirectTo: 'login-developer', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
