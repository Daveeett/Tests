import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { IBaseResponse } from '../../../interfaces/ibase-response';
import { TenantsResponse } from '../../../interfaces/Responses/Developer/Tenants/tenants-response';
import { UpdateTenantRequest } from '../../../interfaces/Requests/Tenants/update-tenant-request';
import { API_CONFIG } from '../../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class TenantsService {
  private readonly basePath = API_CONFIG.DEVELOPER_BASE_PATH;

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {}

  // Obtener todos los tenants
   
  public getAllTenants(): Observable<IBaseResponse<TenantsResponse[]>> {
    const url = this.api.url(`${this.basePath}/getalltenants`);
    return this.http.get<IBaseResponse<TenantsResponse[]>>(url);
  }

  public updateTenant(request: UpdateTenantRequest): Observable<IBaseResponse<TenantsResponse>> {
    const url = this.api.url(`${this.basePath}/update`);
    return this.http.put<IBaseResponse<TenantsResponse>>(url, request);
  }


}
