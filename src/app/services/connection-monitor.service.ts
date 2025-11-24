import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Ping } from './ping';
import { error } from 'console';
import { response } from 'express';

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

  //Inicia el monitoreo de conexión con ping cada 3 segundos
  public startMonitoring(): void {
    // Solo ejecutar en el browser
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Si ya está monitoreando no inicia de nuevo
    if (this.monitoringSubscription) {
      return;
    }

    console.log('Iniciando monitoreo de conexión...');

    this.monitoringSubscription = interval(3000)
      .pipe(
        switchMap(() => 
          this.pingService.ping().pipe(
            catchError((error) => {
              // Si hay error en el ping, retornar un observable con resultado falso
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

          // Detectar cambio de estado
          if (wasConnected && !this.isConnected) {
            // Conexión perdida
            console.warn('Conexión perdida con el backend');
            this.onConnectionLostCallback?.();
          } else if (!wasConnected && this.isConnected) {
            // Conexión restaurada
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

  //Detiene el monitoreo de conexión
  public stopMonitoring(): void {
    if (this.monitoringSubscription) {
      this.monitoringSubscription.unsubscribe();
      this.monitoringSubscription = undefined;
    }
  }

  //Registra callback para cuando se pierde la conexión
  public onConnectionLost(callback: () => void): void {
    this.onConnectionLostCallback = callback;
  }

  //Registra callback para cuando se restaura la conexión

  public onConnectionRestored(callback: () => void): void {
    this.onConnectionRestoredCallback = callback;
  }

  // Retorna el estado actual de la conexión
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
