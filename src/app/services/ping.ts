import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api-service';
import { Observable } from 'rxjs';
import { IBaseResponse } from '../interfaces/ibase-response';


@Injectable({
  providedIn: 'root',
})
export class Ping {

  private readonly tests = '/app';

  constructor(private http: HttpClient, private api: ApiService){}

    //ping para verificar conexion
    public ping(): Observable<IBaseResponse<any>> {
      const url = this.api.url(`${this.tests}/ping`);
      return this.http.get<IBaseResponse<any>>(
        url,
      );
    }
  
}
