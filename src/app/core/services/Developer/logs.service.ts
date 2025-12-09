import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { IBaseResponse } from '../../../interfaces/ibase-response';
import { LogsUsersResponse } from '../../../interfaces/Responses/Developer/LogsUsers/logs-users-response';
import { LogsResponse } from '../../../interfaces/Responses/Developer/Logs/logs-responses';
import { LogsPaginationResponse } from '../../../interfaces/Responses/Developer/Logs/logs-pagination-response';
import { API_CONFIG } from '../../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  private readonly basePath = API_CONFIG.DEVELOPER_BASE_PATH;

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {}

  // Obtiene los logs de los usuarios
  public getLogsUsers(): Observable<IBaseResponse<LogsUsersResponse>> {
    const url = this.api.url(`${this.basePath}/logsusers`);
    return this.http.get<IBaseResponse<LogsUsersResponse>>(url);
  }

  // Obtiene los logs por rango de fecha y pagina
  public getLogs(
    startDate: string,
    endDate: string,
    page: number
  ): Observable<IBaseResponse<LogsResponse>> {
    const url = this.api.url(`${this.basePath}/logs`);
    const params = new HttpParams()
      .set('FromDate', startDate)
      .set('ToDate', endDate)
      .set('Page', page.toString());

    return this.http.get<IBaseResponse<LogsResponse>>(url, { params });
  }

  // Obtiene la informacion de paginacion para los logs por rango de fecha
  public getPaginationLogsByDate(
    startDate: string,
    endDate: string
  ): Observable<IBaseResponse<LogsPaginationResponse>> {
    const url = this.api.url(`${this.basePath}/logs-pagination`);
    const params = new HttpParams()
      .set('FromDate', startDate)
      .set('ToDate', endDate);

    return this.http.get<IBaseResponse<LogsPaginationResponse>>(url, { params });
  }
}
