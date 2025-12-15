import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppsettingsService } from '../../core/services/Configuration/appsettings.service';
import { GetConfigurationResponse } from '../../interfaces/Responses/Configuration-tenant/get-configuration-response';
import { ToastNotificationService } from '../../services/toast-notification.service';

@Component({
  selector: 'app-configuration-tenant',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    this.appSettingsService.getAppSettings().subscribe({
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
      
      this.appSettingsService.updateConfig(configData).subscribe({
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
  //1.- El proyecto utiliza el entorno de Development y carga la configuracion del archivo Development.json el cual está en la raiz del proyecto.
  //2.- Tuve que cambia el entorno a test para poder usar el archivo el cual tenía que modificar
  //3.- Tuve que crear una nueva configuracion para poder usar el archivo de test, ya que el proyecto por defecto solo carga entornos que estén en la raiz del proyecto
  //4.- EN el front cree interfaces para cada atributo del archivo de configuracion  appsettings.test.json para poder manejarlo de manera mas ordenada
  //5.- Debería cambiar las intefaces para que solo se envie un json sin nada de interfaces 
}
