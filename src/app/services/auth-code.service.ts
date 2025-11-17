import { Time } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthCodeService {

  private readonly AUTH_CODE_KEY = 'authCode';
  private readonly AUTH_CODE_EXPIRY_KEY = 'authCodeExpiry';
  private readonly CODE_EXPIRY_TIME = 1 * 60 * 1000 ; 

  constructor() {}

    public saveAuthCode(code: string): void {
        const expiryTime = new Date().getTime() + this.CODE_EXPIRY_TIME;
        localStorage.setItem(this.AUTH_CODE_KEY, code);
        localStorage.setItem(this.AUTH_CODE_EXPIRY_KEY, expiryTime.toString());
        }

   

    private isLocalStorageAvailable(): boolean {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    public getAuthCode(): string | null {
        if (!this.isLocalStorageAvailable()) {
            console.warn('localStorage no está disponible');
            return null;
        }

        const code = localStorage.getItem(this.AUTH_CODE_KEY);
        const expiry = localStorage.getItem(this.AUTH_CODE_EXPIRY_KEY);

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



  public getRemainingTime(): number {
    const expiry = localStorage.getItem(this.AUTH_CODE_EXPIRY_KEY);
    if (!expiry) return 0;

    const expiryTime = parseInt(expiry, 10);
    const currentTime = new Date().getTime();
    const remaining = Math.floor((expiryTime - currentTime) / 1000);

    return remaining > 0 ? remaining : 0;
  }


  public clearAuthCode(): void {
    localStorage.removeItem(this.AUTH_CODE_KEY);
    localStorage.removeItem(this.AUTH_CODE_EXPIRY_KEY);
    console.log('Código de autenticación limpiado');
  }

  public logoutAndRedirect(): void {
    this.clearAuthCode();
  }
}