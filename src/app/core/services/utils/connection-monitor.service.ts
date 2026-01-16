import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { PingService } from './ping.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectionMonitorService {
  private platformId = inject(PLATFORM_ID);
  private pingService = inject(PingService);

  private monitoringSubscription?: Subscription;
  private isConnected: boolean = true;
  private onConnectionLostCallback?: () => void;
  private onConnectionRestoredCallback?: () => void;

  private readonly CHECK_INTERVAL = 10 * 1000; // 10 seconds

  public startMonitoring(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (this.monitoringSubscription) {
      return;
    }

    this.monitoringSubscription = interval(this.CHECK_INTERVAL)
      .pipe(
        switchMap(() =>
          this.pingService.ping().pipe(
            catchError((error) => {
              console.error('[ConnectionMonitor] Error in ping:', error);
              return of({ result: false, data: null, message: 'Connection failed' });
            })
          )
        )
      )
      .subscribe({
        next: (response) => {
          const wasConnected = this.isConnected;
          this.isConnected = response.result === true;

          if (wasConnected && !this.isConnected) {
            console.warn('[ConnectionMonitor] Connection lost with backend');
            this.onConnectionLostCallback?.();
          } else if (!wasConnected && this.isConnected) {
            console.log('[ConnectionMonitor] Connection restored with backend');
            this.onConnectionRestoredCallback?.();
          }
        },
        error: (err) => {
          console.error('[ConnectionMonitor] Error in subscription:', err);
          if (this.isConnected) {
            this.isConnected = false;
            this.onConnectionLostCallback?.();
          }
        },
      });
  }

  public stopMonitoring(): void {
    if (this.monitoringSubscription) {
      this.monitoringSubscription.unsubscribe();
      this.monitoringSubscription = undefined;
    }
  }

  public onConnectionLost(callback: () => void): void {
    this.onConnectionLostCallback = callback;
  }

  public onConnectionRestored(callback: () => void): void {
    this.onConnectionRestoredCallback = callback;
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
