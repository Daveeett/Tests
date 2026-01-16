import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TenantsService } from '../../../core/services/Developer/tenants.service';
import { TenantsResponse, Plan } from '../../../interfaces/Responses/Developer/Tenants/tenants-response';
import { CreateTenantRequest } from '../../../interfaces/Requests/Tenants/create-tenant-request';
import { ToastNotificationService } from '../../../core/services/utils/toast-notification.service';

@Component({
  selector: 'app-modal-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-create.html',
  styleUrl: './modal-create.css',
})
export class ModalCreate {
  @Output() tenantCreated = new EventEmitter<TenantsResponse>();
  @Output() modalClosed = new EventEmitter<void>();
  
  @ViewChild('modalDialog') modalDialog!: ElementRef<HTMLDialogElement>;
  
  tenantForm: FormGroup;
  isSubmitting = false;
  availablePlans: Plan[] = [];

  constructor(
    private fb: FormBuilder,
    private tenantsService: TenantsService,
    private toastService: ToastNotificationService
  ) {
    this.tenantForm = this.fb.group({
      enterpriseName: ['', Validators.required],
      schemaName: ['', Validators.required],
      domain: ['', Validators.required],
      activateImmediately: [true],
      identification: ['', Validators.required],
      
      planId: ['', Validators.required],
      planExpireAt: ['', Validators.required],
      
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      userIdentification: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      
      smtpHost: ['', Validators.required],
      smtpPort: [587, [Validators.required, Validators.min(1), Validators.max(65535)]],
      smtpUsername: ['', Validators.required],
      smtpPassword: ['', Validators.required],
      smtpSenderAddress: ['', [Validators.required, Validators.email]],
      smtpSenderName: ['', Validators.required],
      smtpEnableSsl: [false]
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
      this.tenantForm.reset({
        activateImmediately: true,
        smtpPort: 587,
        smtpEnableSsl: false
      });
      this.modalClosed.emit();
    }
  }

  onSubmit(): void {
    if (this.tenantForm.valid) {
      this.isSubmitting = true;
      
      const formValue = this.tenantForm.value;
      const expireAtDate = new Date(formValue.planExpireAt);
      const expireAtISO = expireAtDate.toISOString();
      
      const createRequest: CreateTenantRequest = {
        enterpriseName: formValue.enterpriseName,
        schemaName: formValue.schemaName,
        domain: formValue.domain,
        activateImmediately: formValue.activateImmediately === true || formValue.activateImmediately === 'true',
        identification: formValue.identification,
        plan: {
          id: parseInt(formValue.planId, 10),
          expireAt: expireAtISO
        },
        firstUser: {
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          emailAddress: formValue.emailAddress,
          identification: formValue.userIdentification,
          password: formValue.password
        },
        smtp: {
          host: formValue.smtpHost,
          port: parseInt(formValue.smtpPort, 10),
          username: formValue.smtpUsername,
          password: formValue.smtpPassword,
          senderAddress: formValue.smtpSenderAddress,
          senderName: formValue.smtpSenderName,
          EnableSsl: formValue.smtpEnableSsl === true || formValue.smtpEnableSsl === 'true'
        }
      };

      this.tenantsService.createTenant(createRequest).subscribe({
        next: (response) => {
          console.log('Tenant created successfully:', response);
          this.isSubmitting = false;
          if (response.data) {
            this.tenantCreated.emit(response.data);
          }
          this.toastService.show(
            'Tenant creado exitosamente',
            'success',
            4000
          );
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating tenant:', error);
          this.isSubmitting = false;
          this.toastService.show(
            'Error al crear el tenant',
            'error',
            4000
          );
        }
      });
    }
  }
}
