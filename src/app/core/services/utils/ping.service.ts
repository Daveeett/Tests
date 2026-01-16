import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { IBaseResponse } from '../../../interfaces/ibase-response';

@Injectable({
  providedIn: 'root',
})
export class PingService {
  private readonly basePath = '/app';

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {}

  public ping(): Observable<IBaseResponse<any>> {
    const url = this.api.url(`${this.basePath}/ping`);
    return this.http.get<IBaseResponse<any>>(url);
  }
}
