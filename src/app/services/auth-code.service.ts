
import { Time } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { clearInterval } from 'node:timers';

@Injectable({
  providedIn: 'root',
})
export class AuthCodeService {

  private readonly AUTH_CODE_KEY = 'authCode';
  private readonly AUTH_CODE_EXPIRY_KEY = 'authCodeExpiry';
  private readonly CODE_EXPIRY_TIME = 1 * 60 * 60 * 2000; 
  private sesionTimer:any=null;

  constructor(private router:Router) {}
  
  //empezar contador de tiempo, verificar si la sesion es valida y redigir cuando la sesion expira
  public startSessionTimer(): void {
    if (this.sesionTimer) clearInterval(this.sesionTimer);
    this.sesionTimer = setInterval(() => {
      if (!this.isSessionValid()) {
        this.clearAuthCode();
        console.warn('Su sesión ha expirado, redirigiendo al login');
        clearInterval(this.sesionTimer);
        this.router.navigateByUrl('/login-developer');
      }
    }, 2000);
  }

  //funcion para verificar que la sesion sea válida
  public isSessionValid(): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }
    const expiry = localStorage.getItem(this.AUTH_CODE_EXPIRY_KEY);
    if (!expiry) {
      return false;
    }
    const expiryTime = parseInt(expiry, 10);
    const currentTime = new Date().getTime();
    const isValid = currentTime < expiryTime;
    return isValid;
  }
  
  //guardar el codigo de autenticacion
  public saveAuthCode(code: string): void {
    if (!this.isLocalStorageAvailable()) {
      console.error('[AuthCodeService] localStorage not available, cannot save code');
      return;
    }
    const expiryTime = new Date().getTime() + this.CODE_EXPIRY_TIME;
    localStorage.setItem(this.AUTH_CODE_KEY, code);
    localStorage.setItem(this.AUTH_CODE_EXPIRY_KEY, expiryTime.toString());
  }
   
  //verificar que el localstorage esté dispoible
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

  //obtener el authcode    
  public getAuthCode(): string | null {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }

    const code = localStorage.getItem(this.AUTH_CODE_KEY);
    const expiry = localStorage.getItem(this.AUTH_CODE_EXPIRY_KEY);

    if (!code || !expiry) {
      return null;
    }

    const expiryTime = parseInt(expiry, 10);
    const currentTime = new Date().getTime();
    //verificacion que el tiempo de sesion no exceda el tiempo transcurrido
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

  //funcion para obtener el tiempo restante de la sesion
  public getRemainingTime(): number {
    if (!this.isLocalStorageAvailable()) return 0;
    const expiry = localStorage.getItem(this.AUTH_CODE_EXPIRY_KEY);
    if (!expiry) return 0;

    const expiryTime = parseInt(expiry, 10);
    const currentTime = new Date().getTime();
    const remaining = Math.floor((expiryTime - currentTime) / 1000);

    return remaining > 0 ? remaining : 0;
  }

  //funcion para limpiar el authcode
  public clearAuthCode(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.AUTH_CODE_KEY);
      localStorage.removeItem(this.AUTH_CODE_EXPIRY_KEY);
      console.log('Código de autenticación limpiado');
    }
  }

  //iniciar sesion si aun es valido el tiempo
  public initializeSessionIfExists(): void {
    if (this.isSessionValid()) {
      this.startSessionTimer();
    }
    
  }

  //cerrar sesion y redirigir al login
  public logoutAndRedirect(): void {
    // detiene el contador
    if (this.sesionTimer) {
      clearInterval(this.sesionTimer);
      this.sesionTimer = null;
    }
    // limpia el authcode del localStorage
    this.clearAuthCode();
    // redirige a login 
    this.router.navigateByUrl('/login-developer');
  }
}