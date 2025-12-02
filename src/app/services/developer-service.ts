import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { LoginDeveloperRequest } from '../interfaces/Requests/Developer/login-developer-request';
import { IBaseResponse } from '../interfaces/ibase-response';
import { ILoginDeveloperResponse } from '../interfaces/Responses/Developer/Ilogin-developer-response';
import { ValidateCodeRequest } from '../interfaces/Requests/Developer/validate-code-request';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { LogsUsersResponse } from '../interfaces/Responses/LogsUsers/logs-users-response';
import { LogsResponse } from '../interfaces/Responses/Logs/logs-responses';
import { LogsPaginationResponse } from '../interfaces/Responses/Logs/logs-pagination-response';

@Injectable({
  providedIn: 'root',
})
export class DeveloperService {
  private readonly headers = new HttpHeaders({
    'X-Skip-Authorization':'true',
  });

  private readonly developerBase = '/developer';

  constructor(private http: HttpClient, private api: ApiService) {}

  //consumir el endpoint login(valida que el usuario ingresado exista)
  public validateUser(data: LoginDeveloperRequest): Observable<IBaseResponse<ILoginDeveloperResponse>> {
    const url = this.api.url(`${this.developerBase}/login`);
    return this.http.post<IBaseResponse<ILoginDeveloperResponse>>(
      url, 
      data
    );
  }

  //consumir el endpoint sendauthenticatecode(envia el codigo de autenticacion al correo)
  public sendAuthenticationCode(data: LoginDeveloperRequest): Observable<IBaseResponse<any>> {
    const url = this.api.url(`${this.developerBase}/sendauthenticatecode`);
    return this.http.post<IBaseResponse<any>>(
      url,data
    );
  }

  //consumir el endpoint validateauthenticatecode(verificar que el correo ingresado sea el mismo que el codigo enviado al correo)
  public verifyAuthenticationCode( code: ValidateCodeRequest): Observable<IBaseResponse<any>> {
    
    const url = this.api.url(`${this.developerBase}/validateauthenticatecode`);
    
    return this.http.post<IBaseResponse<any>>(url,code);
  }

  //consumir el endpoint getlogs (trae una lista de los logs de los usuarios que inician sesion)    
  public getLogsUsers(): Observable<IBaseResponse<LogsUsersResponse>> {
    const url = this.api.url(`${this.developerBase}/getlogs`);
    return this.http.get<IBaseResponse<LogsUsersResponse>>(
      url,
    );
  }

  public getLogsByPage(startDate: string, endDate: string, page: number): Observable<IBaseResponse<LogsResponse>> {
    const url = this.api.url(`${this.developerBase}/logs`);
    return this.http.get<IBaseResponse<LogsResponse>>(
      url,
      {
        params: new HttpParams()
          .set('FromDate', startDate)
          .set('ToDate', endDate)
          .set('Page', page.toString())
      }
    );
  }


  public getPaginationLogsByDate(startDate: string, endDate: string): Observable<IBaseResponse<LogsPaginationResponse>> {
    const url = this.api.url(`${this.developerBase}/logs-pagination`);
    return this.http.get<IBaseResponse<LogsPaginationResponse>>(
      url,
      {
        params: new HttpParams()
          .set('FromDate', startDate)
          .set('ToDate', endDate)
      }
    );
  }

  
  
}