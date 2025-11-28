import { Routes } from '@angular/router';
import { LoginDeveloper } from './pages/login-developer/login-developer';
import { Tests } from './pages/tests/tests';
import { LogsUsers } from './pages/logs-users/logs-users';
import { AuthGuard } from './guards/auth.guard';
import { Prueba } from './pages/prueba/prueba';
import { Logs } from './pages/logs/logs';

export const routes: Routes = [
  { path: 'login-developer', component: LoginDeveloper },
  { path: 'tests', component: Tests, canActivate: [AuthGuard] },
  { path: 'logs-users', component: LogsUsers, canActivate: [AuthGuard]  },
  {path:'prueba',component:Prueba,canActivate:[AuthGuard]},
  {path:'logs',component:Logs,canActivate:[AuthGuard]},
  { path: '', redirectTo: 'login-developer', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
