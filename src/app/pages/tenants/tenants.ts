import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeveloperService } from '../../services/developer-service';
import { TenantsResponse } from '../../interfaces/Responses/Tenants/tenants-response';
import { AuthCodeService } from '../../services/auth-code.service';

@Component({
  selector: 'app-tenants',
  imports: [CommonModule, ],
  templateUrl: './tenants.html',
  styleUrl: './tenants.css',
})

export class Tenants {
  tenants: TenantsResponse[] = [];
  paginatedTenants: TenantsResponse[] = [];

  constructor(private developerService: DeveloperService,private authCodeService: AuthCodeService) {}

  ngOnInit(): void {
    this.developerService.getAllTenants().subscribe((response) => {
      if (response && response.data) {
        this.tenants = response.data;
        this.paginatedTenants = response.data;
      }
    });
  }

  // Método auxiliar para formatear fechas
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
 //cerrar sesión
    public logout(): void {
      this.authCodeService.logoutAndRedirect();
    }
  
}
