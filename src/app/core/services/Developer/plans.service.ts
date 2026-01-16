import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { IBaseResponse } from '../../../interfaces/ibase-response';
import { Plan, TenantsResponse } from '../../../interfaces/Responses/Developer/Tenants/tenants-response';
import { UpdateTenantRequest } from '../../../interfaces/Requests/Developer/Tenants/update-tenant-request';
import { API_CONFIG } from '../../constants/app.constants';


@Injectable({
  providedIn: 'root',
})
export class PlansService {

  private readonly basePath = API_CONFIG.DEVELOPER_BASE_PATH;
    constructor(
    private http: HttpClient,
    private api: ApiService
  ) {}

    public getAllPlans(): Observable<IBaseResponse<Plan[]>> {
      const url = this.api.url(`${this.basePath}/plans`);
      return this.http.get<IBaseResponse<Plan[]>>(url);
    }
}
