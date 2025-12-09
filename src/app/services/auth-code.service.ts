import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_CONFIG, STORAGE_KEYS } from '../core/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthCodeService {
  private sessionTimer: any = null;

  constructor(private router: Router) {}

  // Inicia el temporizador de sesion
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

  // Verifica si la sesion es valida
  public isSessionValid(): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }
    
    const expiry = localStorage.getItem(STORAGE_KEYS.AUTH_CODE_EXPIRY);
    if (!expiry) {
      return false;
    }
    
    const expiryTime = parseInt(expiry, 10);
    const currentTime = new Date().getTime();
    const isValid = currentTime < expiryTime;
    
    return isValid;
  }
  
  //Guarda el codigo de autenticacion en localStorage
  public saveAuthCode(code: string): void {
    if (!this.isLocalStorageAvailable()) {
      console.error('[AuthCodeService] localStorage not available, cannot save code');
      return;
    }
    
    const expiryTime = new Date().getTime() + SESSION_CONFIG.EXPIRY_TIME;
    localStorage.setItem(STORAGE_KEYS.AUTH_CODE, code);
    localStorage.setItem(STORAGE_KEYS.AUTH_CODE_EXPIRY, expiryTime.toString());
  }
   
  // Verifica si localStorage esta disponible (maneja SSR)
  private isLocalStorageAvailable(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  //Obtiene el codigo de autenticacion de localStorage
  public getAuthCode(): string | null {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }

    const code = localStorage.getItem(STORAGE_KEYS.AUTH_CODE);
    const expiry = localStorage.getItem(STORAGE_KEYS.AUTH_CODE_EXPIRY);

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
    if (!this.isLocalStorageAvailable()) {
      return false;
    }
    return this.getAuthCode() !== null;
  }

  /**
   * Obtiene el tiempo restante de la sesion en segundos
   */
  public getRemainingTime(): number {
    if (!this.isLocalStorageAvailable()) {
      return 0;
    }
    
    const expiry = localStorage.getItem(STORAGE_KEYS.AUTH_CODE_EXPIRY);
    if (!expiry) {
      return 0;
    }

    const expiryTime = parseInt(expiry, 10);
    const currentTime = new Date().getTime();
    const remaining = Math.floor((expiryTime - currentTime) / 1000);

    return remaining > 0 ? remaining : 0;
  }

  /**
   * Limpia el codigo de autenticacion de localStorage
   */
  public clearAuthCode(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_CODE);
      localStorage.removeItem(STORAGE_KEYS.AUTH_CODE_EXPIRY);
    }
  }

  //iniciar sesion si aun es valido el tiempo
  public initializeSessionIfExists(): void {
    if (this.isSessionValid()) {
      this.startSessionTimer();
    }
    
  }

  /**
   * Cierra la sesion y redirecciona al login
   */
  public logoutAndRedirect(): void {
    // Stop session timer
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = null;
    }
    
    // Limpia el codigo de autenticacion
    this.clearAuthCode();
    
    // Redirecciona al login
    this.router.navigateByUrl('/login-developer');
  }
}