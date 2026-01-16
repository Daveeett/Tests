import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthSessionService } from '../core/services/auth/auth-session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authSessionService: AuthSessionService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    console.log('[AuthGuard] canActivate called for route:', state.url);
    if (!isPlatformBrowser(this.platformId)) {
      console.log('[AuthGuard] Running on server, allowing navigation');
      return true;
    }
    const isValid = this.authSessionService.isSessionValid();
    console.log('[AuthGuard] Session valid:', isValid);
    if (isValid) {
      console.log('[AuthGuard] Allowing navigation to:', state.url);
      return true;
    }
    console.warn('[AuthGuard] Session invalid, redirecting to login. ReturnUrl:', state.url);
    return this.router.createUrlTree(['/login-developer'], { queryParams: { returnUrl: state.url } });
  }
}