import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppsettingsService } from '../../core/services/Configuration/appsettings.service';
import { GetConfigurationResponse } from '../../interfaces/Responses/Configuration-tenant/get-configuration-response';
import { ToastNotificationService } from '../../core/services/utils/toast-notification.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionSettingsOutline } from '@ng-icons/ionicons';

@Component({
  selector: 'app-configuration-tenant',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon],
  viewProviders: [provideIcons({ ionSettingsOutline })],
  templateUrl: './configuration-tenant.html',
  styleUrl: './configuration-tenant.css',
})
export class Configuration implements OnInit {
  public configurationJson: string = '';
  public isLoading: boolean = false;

  constructor(
    private appSettingsService: AppsettingsService,
    private toastService: ToastNotificationService
  ) {}

  ngOnInit(): void {
    this.loadConfiguration();
  }

  loadConfiguration(): void {
    this.isLoading = true;
    this.appSettingsService.getMyConfig().subscribe({
      next: (response) => {
        if (response.result && response.data) {
          this.configurationJson = JSON.stringify(response.data, null, 4);
        } else {
          this.toastService.show(
            response.message || 'Error loading configuration',
            'error'
          );
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading configuration', err);
        this.toastService.show('Error loading configuration', 'error');
        this.isLoading = false;
      }
    });
  }

  saveConfiguration(): void {
    this.isLoading = true;
    try {
      const configData: GetConfigurationResponse = JSON.parse(this.configurationJson);
      
      this.appSettingsService.updateMyConfig(configData).subscribe({
        next: (response) => {
            if(response.result){
                this.toastService.show(
                  response.message || 'Configuracion actualizada exitosamente',
                  'success'
                );
                console.log(response);
            } else {
                this.toastService.show(
                  response.message || 'Error actualizando configuracion',
                  'error'
                );
            }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error updating configuration', err);
          this.toastService.show('Error actualizando configuracion', 'error');
          this.isLoading = false;
        }
      });
    } catch (e) {
      this.toastService.show('Invalid JSON format', 'error');
      this.isLoading = false;
    }
  }
}
