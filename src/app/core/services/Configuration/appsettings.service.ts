import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { IBaseResponse } from '../../../interfaces/ibase-response';
import { GetConfigurationResponse } from '../../../interfaces/Responses/Configuration-tenant/get-configuration-response';
import { UpdateConfigurationRequest } from '../../../interfaces/Requests/Configuration-tenant/update-configuration-request';
import { API_CONFIG } from '../../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class AppsettingsService {
    private readonly basePath = API_CONFIG.DEVELOPER_BASE_PATH;

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {}
  
    public getMyConfig(): Observable<IBaseResponse<GetConfigurationResponse>> {
      const url = this.api.url(`${this.basePath}/getmyconfig`);
      return this.http.get<IBaseResponse<GetConfigurationResponse>>(url);
    }
    
    public updateMyConfig(config: GetConfigurationResponse): Observable<IBaseResponse<boolean>> {
      const url = this.api.url(`${this.basePath}/updatemyconfig`);
      const requestBody: UpdateConfigurationRequest = {
        Configuration: config
      };
      return this.http.put<IBaseResponse<boolean>>(url, requestBody);
    }
}
