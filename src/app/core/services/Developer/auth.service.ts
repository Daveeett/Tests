import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { LoginDeveloperRequest } from '../../../interfaces/Requests/Developer/login-developer-request';
import { ValidateCodeRequest } from '../../../interfaces/Requests/Developer/validate-code-request';
import { IBaseResponse } from '../../../interfaces/ibase-response';
import { ILoginDeveloperResponse } from '../../../interfaces/Responses/Developer/Login/Ilogin-developer-response';
import { API_CONFIG } from '../../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly basePath = API_CONFIG.DEVELOPER_BASE_PATH;

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {}

  // Valida si un usuario developer existe
  public validateUser(
    data: LoginDeveloperRequest
  ): Observable<IBaseResponse<ILoginDeveloperResponse>> {
    const url = this.api.url(`${this.basePath}/login`);
    return this.http.post<IBaseResponse<ILoginDeveloperResponse>>(url, data);
  }

  // Envía el codigo de autenticacion al correo
  public sendAuthenticationCode(data: LoginDeveloperRequest): Observable<IBaseResponse<any>> {
    const url = this.api.url(`${this.basePath}/sendauthenticatecode`);
    return this.http.post<IBaseResponse<any>>(url, data);
  }

  // Verifica el codigo de autenticacion
  public verifyAuthenticationCode(code: ValidateCodeRequest): Observable<IBaseResponse<any>> {
    const url = this.api.url(`${this.basePath}/validateauthenticatecode`);
    return this.http.post<IBaseResponse<any>>(url, code);
  }
}
