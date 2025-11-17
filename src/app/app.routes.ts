import { Routes } from '@angular/router';
import { LoginDeveloper } from './pages/login-developer/login-developer';
import { Tests } from './pages/tests/tests';
import { LogsUsers } from './pages/logs-users/logs-users';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login-developer', component: LoginDeveloper },
  { path: 'tests', component: Tests, canActivate: [AuthGuard] },
  { path: 'logs-users', component: LogsUsers,  },
  { path: '', redirectTo: 'logs-users', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
