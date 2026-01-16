import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../storage/local-storage.service';
import { SESSION_CONFIG, STORAGE_KEYS } from '../../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private sessionTimer: any = null;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  public startSessionTimer(): void {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
    }

    this.sessionTimer = setInterval(() => {
      if (!this.isSessionValid()) {
        this.clearAuthCode();
        console.warn('Su sesión ha expirado, redirigiendo al login');
        clearInterval(this.sessionTimer);
        this.router.navigateByUrl('/login-developer');
      }
    }, SESSION_CONFIG.CHECK_INTERVAL);
  }

  public stopSessionTimer(): void {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  public isSessionValid(): boolean {
    const expiry = this.localStorage.getItem(STORAGE_KEYS.AUTH_CODE_EXPIRY);
    if (!expiry) {
      return false;
    }

    const expiryTime = parseInt(expiry, 10);
    const currentTime = new Date().getTime();
    return currentTime < expiryTime;
  }

  public saveAuthCode(code: string): void {
    const expiryTime = new Date().getTime() + SESSION_CONFIG.EXPIRY_TIME;
    this.localStorage.setItem(STORAGE_KEYS.AUTH_CODE, code);
    this.localStorage.setItem(STORAGE_KEYS.AUTH_CODE_EXPIRY, expiryTime.toString());
  }

  public getAuthCode(): string | null {
    const code = this.localStorage.getItem(STORAGE_KEYS.AUTH_CODE);
    const expiry = this.localStorage.getItem(STORAGE_KEYS.AUTH_CODE_EXPIRY);

    if (!code || !expiry) {
      return null;
    }

    const expiryTime = parseInt(expiry, 10);
    const currentTime = new Date().getTime();

    if (currentTime > expiryTime) {
      this.clearAuthCode();
      console.warn('El código de autenticación ha expirado');
      return null;
    }

    return code;
  }

  public hasValidAuthCode(): boolean {
    return this.getAuthCode() !== null;
  }

  public getRemainingTime(): number {
    const expiry = this.localStorage.getItem(STORAGE_KEYS.AUTH_CODE_EXPIRY);
    if (!expiry) {
      return 0;
    }

    const expiryTime = parseInt(expiry, 10);
    const currentTime = new Date().getTime();
    const remaining = Math.floor((expiryTime - currentTime) / 1000);

    return remaining > 0 ? remaining : 0;
  }

  public clearAuthCode(): void {
    this.localStorage.removeItem(STORAGE_KEYS.AUTH_CODE);
    this.localStorage.removeItem(STORAGE_KEYS.AUTH_CODE_EXPIRY);
  }
  
  public initializeSessionIfExists(): void {
    if (this.isSessionValid()) {
      this.startSessionTimer();
    }
  }

  public logoutAndRedirect(): void {
    this.stopSessionTimer();
    this.clearAuthCode();
    this.router.navigateByUrl('/login-developer');
  }
}
