import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { LoginDeveloperRequest } from '../interfaces/Requests/login-developer-request';

@Injectable({
  providedIn: 'root',
})
export class DeveloperService {

  constructor(private http: HttpClient, private api: ApiService) {}

  public validateUser(emailaddress: LoginDeveloperRequest): Observable<any> {
    const url = this.api.url('/developer/login');
    return this.http.post(url,{emailaddress});
  } 
 
  public sendValidationCode(email: string): Observable<any> {
    const url = this.api.url('/developer/authenticate');
    return this.http.post(url, { email });
  }

  public authenticateWithCode(email: string, code: string): Observable<any> {
    const params = new HttpParams().set('email', email).set('code', code);
    const url = this.api.url('/developer/authenticate');
    return this.http.get(url, { params});
  }

}
