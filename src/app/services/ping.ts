import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api-service';
import { AuthCodeService } from './auth-code.service';
import { Observable, throwError } from 'rxjs';
import { IBaseResponse } from '../interfaces/ibase-response';


@Injectable({
  providedIn: 'root',
})
export class Ping {
  private readonly developerBase = '/app';

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private authCodeService: AuthCodeService
  ) {}

  public ping(): Observable<IBaseResponse<any>> {
    // Verificar si existe un código válido
    const authCode = this.authCodeService.getAuthCode();

    if (!authCode) {
      console.error('Código de autenticación no válido o expirado');
      return throwError(() => new Error('Código de autenticación requerido. Por favor, inicie sesión nuevamente.'));
    }

    const url = this.api.url(`${this.developerBase}/ping`);
    const headers = new HttpHeaders({
      'X-Auth-Code': authCode,
    });

    return this.http.get<IBaseResponse<any>>(url, { headers });
  }
}