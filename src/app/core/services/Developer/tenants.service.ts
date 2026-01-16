import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { IBaseResponse } from '../../../interfaces/ibase-response';
import { TenantsResponse } from '../../../interfaces/Responses/Developer/Tenants/tenants-response';
import { UpdateTenantRequest } from '../../../interfaces/Requests/Developer/Tenants/update-tenant-request';
import { API_CONFIG } from '../../constants/app.constants';
import { CreateTenantRequest } from '../../../interfaces/Requests/Tenants/create-tenant-request';
import { GetConfigurationResponse } from '../../../interfaces/Responses/Configuration-tenant/get-configuration-response';

@Injectable({
  providedIn: 'root',
})
export class TenantsService {
  private readonly basePath = API_CONFIG.DEVELOPER_BASE_PATH;

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {}

  public createTenant(request: CreateTenantRequest): Observable<IBaseResponse<TenantsResponse>> {
    const url = this.api.url(`${this.basePath}/create`);
    return this.http.post<IBaseResponse<TenantsResponse>>(url, request);
  }
  
  public getAllTenants(): Observable<IBaseResponse<TenantsResponse[]>> {
    const url = this.api.url(`${this.basePath}/getalltenants`);
    return this.http.get<IBaseResponse<TenantsResponse[]>>(url);

  }

  public updateTenant(request: UpdateTenantRequest): Observable<IBaseResponse<TenantsResponse>> {
    const url = this.api.url(`${this.basePath}/update`);
    return this.http.put<IBaseResponse<TenantsResponse>>(url, request);
  }

  public getTenantConfigBySchema(schemaName: string): Observable<IBaseResponse<Record<string, any>>> {
    const url = this.api.url(`${this.basePath}/get-config/${schemaName}`);
    return this.http.get<IBaseResponse<Record<string, any>>>(url);
  }

  public updateTenantConfigBySchema(schemaName: string, configuration: Record<string, any>): Observable<IBaseResponse<string>> {
    const url = this.api.url(`${this.basePath}/update-config/${schemaName}`);
    return this.http.put<IBaseResponse<string>>(url, configuration);
  }


}
