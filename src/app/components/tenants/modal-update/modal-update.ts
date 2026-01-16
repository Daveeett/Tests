import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TenantsService } from '../../../core/services/Developer/tenants.service';
import { TenantsResponse, Plan } from '../../../interfaces/Responses/Developer/Tenants/tenants-response';
import { UpdateTenantRequest } from '../../../interfaces/Requests/Developer/Tenants/update-tenant-request';
import { ToastNotificationService } from '../../../core/services/utils/toast-notification.service';

@Component({
  selector: 'app-modal-update',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modal-update.html',
  styleUrl: './modal-update.css',
})
export class ModalUpdate implements OnChanges {
  @Input() tenant: TenantsResponse | null = null;
  @Input() availablePlans: Plan[] = [];
  @Output() tenantUpdated = new EventEmitter<TenantsResponse>();
  @Output() modalClosed = new EventEmitter<void>();
  
  @ViewChild('modalDialog') modalDialog!: ElementRef<HTMLDialogElement>;
  
  tenantForm: FormGroup;
  isSubmitting = false;
  isCurrentDomain = false;
  currentDomain = '';
  errorSchemaNoExist = false;
  configurationJson: string = '';
  isLoadingConfig = false;

  constructor(
    private fb: FormBuilder,
    private tenantsService: TenantsService,
    private toastService: ToastNotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.tenantForm = this.fb.group({
      enterpriseName: ['', Validators.required],
      domain: ['', Validators.required],
      schemaName: ['', Validators.required],
      isActive: [true],
      planId: ['', Validators.required]
    });

    this.tenantForm.get('schemaName')?.valueChanges.subscribe(() => {
      this.errorSchemaNoExist = false;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tenant'] && this.tenant) {
      this.populateForm();
      this.detectCurrentDomain();
      this.loadTenantConfiguration();
    }
  }
  private detectCurrentDomain(): void {
    if (isPlatformBrowser(this.platformId) && this.tenant) {
      const hostname = window.location.hostname;
      const port = window.location.port;
      this.currentDomain = port ? `${hostname}:${port}` : hostname;
      
      let tenantDomain = this.tenant.domain;
      if (tenantDomain.startsWith('http://') || tenantDomain.startsWith('https://')) {
        tenantDomain = tenantDomain.replace(/^https?:\/\//, '');
      }
      
      this.isCurrentDomain = this.currentDomain === tenantDomain;
      
      if (this.isCurrentDomain) {
        this.tenantForm.get('schemaName')?.disable({ emitEvent: false });
      } else {
        this.tenantForm.get('schemaName')?.enable({ emitEvent: false });
      }
    }
  }

  private populateForm(): void {
    if (this.tenant) {
      this.tenantForm.patchValue({
        enterpriseName: this.tenant.enterpriseName,
        domain: this.tenant.domain,
        schemaName: this.tenant.schemaName,
        isActive: this.tenant.isActive,
        planId: this.tenant.plan.planId
      });
    }
  }

  loadTenantConfiguration(): void {
    if (!this.tenant) return;
    
    this.isLoadingConfig = true;
    this.tenantsService.getTenantConfigBySchema(this.tenant.schemaName).subscribe({
      next: (response) => {
        if (response.result && response.data) {
          this.configurationJson = JSON.stringify(response.data, null, 4);
        } else {
          this.toastService.show(
            response.message || 'Error al cargar la configuración',
            'error'
          );
        }
        this.isLoadingConfig = false;
      },
      error: (error) => {
        console.error('Error loading tenant configuration:', error);
        this.toastService.show('Error al cargar la configuración del tenant', 'error');
        this.isLoadingConfig = false;
      }
    });
  }

  openModal(): void {
    if (this.modalDialog) {
      this.modalDialog.nativeElement.showModal();
    }
  }

  closeModal(): void {
    if (this.modalDialog) {
      this.modalDialog.nativeElement.close();
      this.tenantForm.reset();
      this.errorSchemaNoExist = false;
      this.configurationJson = '';
      this.modalClosed.emit();
    }
  }

  onSchemaNameClick(): void {
    if (this.isCurrentDomain) {
      this.toastService.show(
        'No puedes cambiar el schema name porque este es tu dominio actual',
        'error',
        4000
      );
    }
  }

  onSubmit(): void {
    if (this.tenantForm.valid && this.tenant) {
      this.isSubmitting = true;
      this.errorSchemaNoExist = false; 
      
      const updateRequest: UpdateTenantRequest = {
        tenantId: this.tenant.tenantId,
        enterpriseName: this.tenantForm.value.enterpriseName,
        domain: this.tenantForm.value.domain,
        schemaName: this.isCurrentDomain ? this.tenant.schemaName : this.tenantForm.value.schemaName,
        isActive: this.tenantForm.value.isActive,
        planId: this.tenantForm.value.planId
      };

      this.tenantsService.updateTenant(updateRequest).subscribe({
        next: (response) => {
          console.log('Tenant updated successfully:', response);
          
          const schemaName = this.isCurrentDomain ? this.tenant!.schemaName : this.tenantForm.value.schemaName;
          this.updateConfiguration(schemaName);
        },
        error: (error) => {
          console.error('Error updating tenant:', error);
          this.isSubmitting = false;
          
          if (error.error && error.error.message && error.error.message.toLowerCase().includes('schema')) {
            this.errorSchemaNoExist = true;
          } else {
            let errorMessage = 'Error al actualizar el tenant';
            
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            } else if (error.message) {
              errorMessage = error.message;
            }
            
            this.toastService.show(
              errorMessage,
              'error',
              5000
            );
          }
        }
      });
    }
  }

  private updateConfiguration(schemaName: string): void {
    try {
      const configData = JSON.parse(this.configurationJson);
      
      this.tenantsService.updateTenantConfigBySchema(schemaName, configData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.errorSchemaNoExist = false;
          
          if (response.result) {
            this.toastService.show(
              'Tenant y configuración actualizados exitosamente',
              'success'
            );
            this.tenantUpdated.emit(this.tenant!);
            this.closeModal();
          } else {
            this.toastService.show(
              response.message || 'Error al actualizar la configuración',
              'error'
            );
          }
        },
        error: (error) => {
          console.error('Error updating configuration:', error);
          this.isSubmitting = false;
          
          let errorMessage = 'Error al actualizar la configuración';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          this.toastService.show(errorMessage, 'error');
        }
      });
    } catch (e) {
      this.isSubmitting = false;
      this.toastService.show('Formato JSON inválido en la configuración', 'error');
    }
  }
}
