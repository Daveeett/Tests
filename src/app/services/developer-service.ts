import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root',
})
export class DeveloperService {

 

  constructor(private http: HttpClient, private api: ApiService) {}

  /*
       * POST: solicitar/validar correo (envía el código al email)
       * Endpoint: POST /auth/send-code  body: { email }
       
      public sendValidationCode(email: string): Observable<any> {
        const url = this.api.url('/auth/send-code');
        return this.http.post(url, { email });
      }
    

       * GET: verificar/autenticar usando código
       * Endpoint: GET /auth/verify?email=...&code=...

      public authenticateWithCode(email: string, code: string): Observable<any> {
        const params = new HttpParams().set('email', email).set('code', code);
        const url = this.api.url('/auth/verify');
        return this.http.get(url, { params });
      }
    
      
       * Alternativa (si backend usa POST para verificar):
       * public authenticateWithCodePost(email: string, code: string): Observable<any> {
       *   const url = this.api.url('/auth/verify');
       *   return this.http.post(url, { email, code });
       * }
       */
    
    
  
}
