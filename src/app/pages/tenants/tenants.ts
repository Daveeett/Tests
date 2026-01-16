import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantsService } from '../../core/services/Developer/tenants.service';
import { AuthSessionService } from '../../core/services/auth/auth-session.service';
import { TenantsResponse, Plan } from '../../interfaces/Responses/Developer/Tenants/tenants-response';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { ionAdd,ionPencil, ionBusinessOutline,ionIdCardOutline, ionGlobeOutline, ionLayersOutline, ionCheckmarkCircleOutline, ionCardOutline, ionCalendarOutline, ionRefreshOutline, ionSettingsOutline } from "@ng-icons/ionicons";
import { ModalCreate } from '../../components/tenants/modal-create/modal-create';
import { ModalUpdate } from '../../components/tenants/modal-update/modal-update';

@Component({
  selector: 'app-tenants',
  imports: [CommonModule, NgIcon, ModalUpdate, ModalCreate],
  viewProviders: [provideIcons({ ionAdd,ionPencil, ionBusinessOutline, ionIdCardOutline, ionGlobeOutline, ionLayersOutline, ionCheckmarkCircleOutline, ionCardOutline, ionCalendarOutline, ionRefreshOutline, ionSettingsOutline })],
  templateUrl: './tenants.html',
  styleUrl: './tenants.css',
})
export class Tenants implements OnInit {
  tenants: TenantsResponse[] = [];
  paginatedTenants: TenantsResponse[] = [];
  selectedTenant: TenantsResponse | null = null;
  availablePlans: Plan[] = [];

  @ViewChild(ModalUpdate) modalUpdate!: ModalUpdate;
  @ViewChild(ModalCreate) modalCreate!: ModalCreate;
  
  constructor(
    private tenantsService: TenantsService,
    private authSessionService: AuthSessionService,
    
  ) {}

  ngOnInit(): void {
    this.loadTenants();
  }

  private loadTenants(): void {
    this.tenantsService.getAllTenants().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.tenants = response.data;
          this.paginatedTenants = response.data;
          this.extractAvailablePlans();
        }
      },
      error: (err) => {
        console.error('Error loading tenants:', err);
      },
    });
  }

  private extractAvailablePlans(): void {
    const plansMap = new Map<number, Plan>();
    this.tenants.forEach(tenant => {
      if (tenant.plan && !plansMap.has(tenant.plan.planId)) {
        plansMap.set(tenant.plan.planId, tenant.plan);
      }
    });
    this.availablePlans = Array.from(plansMap.values());
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  openModalCreate(){
    this.selectedTenant = null;
    if (this.modalCreate) {
      this.modalCreate.openModal();
    }
  }

  openModalUpdate(tenant: TenantsResponse): void {
    this.selectedTenant = tenant;
    if (this.modalUpdate) {
      this.modalUpdate.openModal();
    }
  }

  onTenantUpdated(updatedTenant: TenantsResponse): void {
    this.loadTenants();
  }

  onModalClosed(): void {
    this.selectedTenant = null;
  }

  public logout(): void {
    this.authSessionService.logoutAndRedirect();
  }

}
