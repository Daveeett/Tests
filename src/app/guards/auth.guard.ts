import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthCodeService } from '../services/auth-code.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authCodeService: AuthCodeService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    // Si hay un código válido, permitir
    if (this.authCodeService.hasValidAuthCode()) {
      return true;
    }

    // Si no está autenticado, redirigir al login y pasar returnUrl
    return this.router.createUrlTree(['/login-developer'], { queryParams: { returnUrl: state.url } });
  }
}