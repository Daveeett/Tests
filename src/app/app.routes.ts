import { Routes } from '@angular/router';
import { LoginDeveloper } from './pages/login-developer/login-developer';
import { Tests } from './pages/tests/tests';
import { LogsUsers } from './pages/logs-users/logs-users';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login-developer', component: LoginDeveloper },
  { path: 'tests', component: Tests, canActivate: [AuthGuard] },
  { path: 'logs-users', component: LogsUsers, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login-developer', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
