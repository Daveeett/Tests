import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TenantsService } from '../../../core/services/Developer/tenants.service';
import { TenantsResponse, Plan } from '../../../interfaces/Responses/Developer/Tenants/tenants-response';
import { UpdateTenantRequest } from '../../../interfaces/Requests/Tenants/update-tenant-request';

@Component({
  selector: 'app-modal-update',
  imports: [CommonModule, ReactiveFormsModule],
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

  constructor(
    private fb: FormBuilder,
    private tenantsService: TenantsService
  ) {
    this.tenantForm = this.fb.group({
      enterpriseName: ['', Validators.required],
      domain: ['', Validators.required],
      schemaName: ['', Validators.required],
      isActive: [true],
      planId: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tenant'] && this.tenant) {
      this.populateForm();
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

  openModal(): void {
    if (this.modalDialog) {
      this.modalDialog.nativeElement.showModal();
    }
  }

  closeModal(): void {
    if (this.modalDialog) {
      this.modalDialog.nativeElement.close();
      this.tenantForm.reset();
      this.modalClosed.emit();
    }
  }

  onSubmit(): void {
    if (this.tenantForm.valid && this.tenant) {
      this.isSubmitting = true;
      
      const updateRequest: UpdateTenantRequest = {
        tenantId: this.tenant.tenantId,
        enterpriseName: this.tenantForm.value.enterpriseName,
        domain: this.tenantForm.value.domain,
        schemaName: this.tenantForm.value.schemaName,
        isActive: this.tenantForm.value.isActive,
        planId: this.tenantForm.value.planId
      };

      this.tenantsService.updateTenant(updateRequest).subscribe({
        next: (response) => {
          console.log('Tenant updated successfully:', response);
          this.isSubmitting = false;
          if (response.data) {
            this.tenantUpdated.emit(response.data);
          }
          this.closeModal();
          
        },
        error: (error) => {
          console.error('Error updating tenant:', error);
          this.isSubmitting = false;
          // TODO: Show error notification to user
        }
      });
    }
  }
}
