import { Component, signal, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthCodeService } from './services/auth-code.service';
import { ConnectionMonitorService } from './services/connection-monitor.service';
import { ModalNoConnection } from './components/modal-no-connection/modal-no-connection';
import { ToastNotification } from './components/toast-notification/toast-notification';
import { Navbartool } from './components/navbartool/navbartool';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalNoConnection, ToastNotification, Navbartool],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  @ViewChild(ModalNoConnection) connectionModal!: ModalNoConnection;
  @ViewChild(ToastNotification) toast!: ToastNotification;
  protected readonly title = signal('test');
  protected showNavbar = signal(true);

  constructor(
    private authCodeService: AuthCodeService,
    private connectionMonitor: ConnectionMonitorService,
    private router: Router
  ) {
    this.authCodeService.initializeSessionIfExists();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showNavbar.set(!event.url.includes('/login-developer'));
    });
  }

  ngOnInit(): void {
    // Configurar callbacks del monitor de conexión
    this.connectionMonitor.onConnectionLost(() => {
      this.connectionModal?.open();
    });

    this.connectionMonitor.onConnectionRestored(() => {
      this.connectionModal?.close();
      // Mostrar toast de éxito
      this.toast?.show('Conexión restaurada exitosamente', 'success', 4000);
    });

    // Iniciar monitoreo
    this.connectionMonitor.startMonitoring();
  }

  ngOnDestroy(): void {
    // Detener monitoreo al destruir el componente
    this.connectionMonitor.stopMonitoring();
  }

  // Maneja el evento de reintentar conexión desde el modal
  public onRetryConnection(): void {
    console.log('Se reintentará la conexión');
  }
}
