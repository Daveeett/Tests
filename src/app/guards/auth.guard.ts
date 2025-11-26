import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthCodeService } from '../services/auth-code.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authCodeService: AuthCodeService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    //Si se esta en el server, se permite la navegacion
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    //Si la sesion es valida, se permite la navegacion
    const isValid = this.authCodeService.isSessionValid();
    if (isValid) {
      return true;
    }
    
    //Si la sesion no es valida, se redirige a la pagina de login
    return this.router.createUrlTree(['/login-developer'], { queryParams: { returnUrl: state.url } });
  }
}