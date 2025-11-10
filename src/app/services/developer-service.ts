import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { LoginDeveloperRequest } from '../interfaces/Requests/login-developer-request';
import { IBaseResponse } from '../interfaces/ibase-response';
import { ILoginDeveloperResponse } from '../interfaces/Responses/Developer/Ilogin-developer-response';

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

  public sendAuthenticationCode(data: string): Observable<IBaseResponse<any>> {
    const url = this.api.url(`${this.developerBase}/authenticate`);
    const headers = new HttpHeaders({ 'developer_authenticate_code': data });
    return this.http.get<IBaseResponse<any>>(
      url,
      {
        headers,
        responseType: 'json'
      }
    );
  }

  public verifyAuthenticationCode(data: string, code: string): Observable<IBaseResponse<any>> {
    const params = new HttpParams()
      .set('email', data)
      .set('code', code);
      
    const url = this.api.url(`${this.developerBase}/authenticate`);
    return this.http.get<IBaseResponse<any>>(url, { params, headers: this.headers });
  }
}