import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Ping } from './ping.service';
import { CONNECTION_CONFIG } from '../core/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ConnectionMonitorService {
  private platformId = inject(PLATFORM_ID);
  private pingService = inject(Ping);
  
  private monitoringSubscription?: Subscription;
  private isConnected: boolean = true;
  private onConnectionLostCallback?: () => void;
  private onConnectionRestoredCallback?: () => void;

  // Empieza el monitoreo de la conexion
  public startMonitoring(): void {
    // Solo ejecuta en el navegador
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // No empieza si ya esta monitoreando
    if (this.monitoringSubscription) {
      return;
    }

    this.monitoringSubscription = interval(CONNECTION_CONFIG.PING_INTERVAL)
      .pipe(
        switchMap(() => 
          this.pingService.ping().pipe(
            catchError((error) => {
              console.error('Error en ping:', error);
              return of({ result: false, data: null, message: 'Connection failed' });
            })
          )
        )
      )
      .subscribe({
        next: (response) => {
          const wasConnected = this.isConnected;
          this.isConnected = response.result === true;

          // Detecta cambios en el estado de la conexión
          if (wasConnected && !this.isConnected) {
            console.warn('Conexión perdida con el backend');
            this.onConnectionLostCallback?.();
          } else if (!wasConnected && this.isConnected) {
            console.log('Conexión restaurada con el backend');
            this.onConnectionRestoredCallback?.();
          }
        },
        error: (err) => {
          console.error('Error en suscripción:', err);
          if (this.isConnected) {
            this.isConnected = false;
            this.onConnectionLostCallback?.();
          }
        }
      });
  }

  // Detiene el monitoreo de la conexion
  public stopMonitoring(): void {
    if (this.monitoringSubscription) {
      this.monitoringSubscription.unsubscribe();
      this.monitoringSubscription = undefined;
    }
  }

  // Registra un callback para el evento de conexión perdida
  public onConnectionLost(callback: () => void): void {
    this.onConnectionLostCallback = callback;
  }

  // Registra un callback para el evento de restauracion de la conexion
  public onConnectionRestored(callback: () => void): void {
    this.onConnectionRestoredCallback = callback;
  }

  // Obtiene el estado de la conexion
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
