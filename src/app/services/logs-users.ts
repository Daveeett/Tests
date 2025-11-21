import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api-service';
import { Observable } from 'rxjs';
import { IBaseResponse } from '../interfaces/ibase-response';
import { LogsUsersResponse } from '../interfaces/Responses/logs-users-response';


@Injectable({
  providedIn: 'root',
})
export class LogsUsers {

  private readonly developerBase = '/logs';

  constructor(private http: HttpClient, private api: ApiService){}

    //consumir el endpoint getlogs (trae una lista de los logs de los usuarios que inician sesion)    
    public getLogs(): Observable<IBaseResponse<LogsUsersResponse>> {
      const url = this.api.url(`${this.developerBase}/getlogs`);
      return this.http.get<IBaseResponse<LogsUsersResponse>>(
        url,
      );
    }
  
}
