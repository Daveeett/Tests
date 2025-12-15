import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantsService } from '../../core/services/Developer/tenants.service';
import { DateUtilsService } from '../../core/services/Developer/date-utils.service';
import { AuthCodeService } from '../../services/auth-code.service';
import { TenantsResponse, Plan } from '../../interfaces/Responses/Developer/Tenants/tenants-response';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { ionPencil } from "@ng-icons/ionicons";
import { ModalUpdate } from '../../components/tenants/modal-update/modal-update';

@Component({
  selector: 'app-tenants',
  imports: [CommonModule, NgIcon, ModalUpdate],
  viewProviders: [provideIcons({ ionPencil })],
  templateUrl: './tenants.html',
  styleUrl: './tenants.css',
})
export class Tenants implements OnInit {
  tenants: TenantsResponse[] = [];
  paginatedTenants: TenantsResponse[] = [];
  selectedTenant: TenantsResponse | null = null;
  availablePlans: Plan[] = [];

  @ViewChild(ModalUpdate) modalUpdate!: ModalUpdate;

  constructor(
    private tenantsService: TenantsService,
    private authCodeService: AuthCodeService,
    private dateUtils: DateUtilsService
  ) {}

  ngOnInit(): void {
    this.loadTenants();
  }

  // Carga todos los tenants
  private loadTenants(): void {
    this.tenantsService.getAllTenants().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.tenants = response.data;
          this.paginatedTenants = response.data;
          // Extract unique plans from tenants
          this.extractAvailablePlans();
        }
      },
      error: (err) => {
        console.error('Error loading tenants:', err);
      },
    });
  }

  // Extrae los planes disponibles de los tenants
  private extractAvailablePlans(): void {
    const plansMap = new Map<number, Plan>();
    this.tenants.forEach(tenant => {
      if (tenant.plan && !plansMap.has(tenant.plan.planId)) {
        plansMap.set(tenant.plan.planId, tenant.plan);
      }
    });
    this.availablePlans = Array.from(plansMap.values());
  }

  // Formatea la fecha
  formatDate(dateString: string): string {
    return this.dateUtils.formatDate(dateString);
  }

  // Abre el modal de actualización
  openModalUpdate(tenant: TenantsResponse): void {
    this.selectedTenant = tenant;
    setTimeout(() => {
      this.modalUpdate.openModal();
    }, 0);
  }

  // Maneja la actualización del tenant
  onTenantUpdated(updatedTenant: TenantsResponse): void {
    if (updatedTenant) {
      const index = this.tenants.findIndex(t => t.tenantId === updatedTenant.tenantId);
      if (index !== -1) {
        this.tenants[index] = updatedTenant;
        // Since paginatedTenants might be the same reference or a shallow copy, we update it too if it's different
        if (this.tenants !== this.paginatedTenants) {
             const pIndex = this.paginatedTenants.findIndex(t => t.tenantId === updatedTenant.tenantId);
             if (pIndex !== -1) {
                 this.paginatedTenants[pIndex] = updatedTenant;
             }
        }
      }
    }
    this.selectedTenant = null;
  }

  // Maneja el cierre del modal
  onModalClosed(): void {
    this.selectedTenant = null;
  }
}
