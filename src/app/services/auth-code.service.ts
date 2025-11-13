import { Time } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthCodeService {

  private readonly AUTH_CODE_KEY = 'authCode';
  private readonly AUTH_CODE_EXPIRY_KEY = 'authCodeExpiry';
  private readonly CODE_EXPIRY_TIME = 1 * 60 * 60 ; 

  constructor() {}

    public saveAuthCode(code: string): void {
        const expiryTime = new Date().getTime() + this.CODE_EXPIRY_TIME;
        localStorage.setItem(this.AUTH_CODE_KEY, code);
        localStorage.setItem(this.AUTH_CODE_EXPIRY_KEY, expiryTime.toString());
        }

    public getAuth():string|null{
        const code=localStorage.getItem(this.AUTH_CODE_KEY);
        const expire=localStorage.getItem(this.AUTH_CODE_EXPIRY_KEY);
        
        if(!code||!expire){
            return null;

        }
        
        const expireTIme=parseInt(expire,10);
        const currentTime= new Date().getTime();
        
        if (currentTime>expireTIme){

            this.clearAuthCode();
            console.error("El codigo de autenticacion ha expirado")
            return null
        }

        return code;

    }

    public getAuthCode(): string | null {
        
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

    public hasValidCode():boolean{
        return this.getAuth()!==null;
    }

    public hasValidAuthCode(): boolean {
        return this.getAuthCode() !== null;
    }


    public getReaminTime():number{

        const expire=localStorage.getItem(this.AUTH_CODE_EXPIRY_KEY);

        if(!expire) return 0;

        const expireTIme= parseInt(expire,10);
        const currentTime= new Date().getTime();
        const remainingTime= Math.floor((expireTIme-currentTime)/1000);
        return remainingTime>0? remainingTime:0;
    }

  public getRemainingTime(): number {
    const expiry = localStorage.getItem(this.AUTH_CODE_EXPIRY_KEY);
    if (!expiry) return 0;

    const expiryTime = parseInt(expiry, 10);
    const currentTime = new Date().getTime();
    const remaining = Math.floor((expiryTime - currentTime) / 1000);

    return remaining > 0 ? remaining : 0;
  }

public clearAuthCod():void{
    localStorage.removeItem(this.AUTH_CODE_KEY);
    localStorage.removeItem(this.AUTH_CODE_EXPIRY_KEY);
    console.log('Codigo de autenticacion limpiado')

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