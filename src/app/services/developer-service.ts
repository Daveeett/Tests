import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { LoginDeveloperRequest } from '../interfaces/Requests/Developer/login-developer-request';
import { IBaseResponse } from '../interfaces/ibase-response';
import { ILoginDeveloperResponse } from '../interfaces/Responses/Developer/Ilogin-developer-response';
import { ValidateCodeRequest } from '../interfaces/Requests/Developer/validate-code-request';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root',
})
export class DeveloperService {
  private readonly headers = new HttpHeaders({
    'X-Skip-Authorization':'true',
  });

  private readonly developerBase = '/developer';

  constructor(private http: HttpClient, private api: ApiService) {}

  public validateUser(data: LoginDeveloperRequest): Observable<IBaseResponse<ILoginDeveloperResponse>> {
    const url = this.api.url(`${this.developerBase}/login`);
    return this.http.post<IBaseResponse<ILoginDeveloperResponse>>(
      url, 
      data
    );
  }

  public sendAuthenticationCode(data: LoginDeveloperRequest): Observable<IBaseResponse<any>> {
    const url = this.api.url(`${this.developerBase}/sendauthenticatecode`);
    return this.http.post<IBaseResponse<any>>(
      url,data
    );
  }

  public verifyAuthenticationCode( code: ValidateCodeRequest): Observable<IBaseResponse<any>> {
    
    const url = this.api.url(`${this.developerBase}/validateauthenticatecode`);
    
    return this.http.post<IBaseResponse<any>>(url,code);
  }
}