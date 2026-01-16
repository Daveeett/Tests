import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  
  public readonly baseUrl = 'http://127.0.0.1:5136/api';

  constructor(public http: HttpClient) {}
  public url(path: string): string {
    return `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }
}
