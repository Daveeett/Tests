import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  
  public readonly baseUrl = 'http://127.0.0.1:5136/api';

  constructor(public http: HttpClient) {}
 
  public url(path: string) {
    return `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }


} 