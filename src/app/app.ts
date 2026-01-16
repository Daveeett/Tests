import { Component, signal, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthSessionService } from './core/services/auth/auth-session.service';
import { ConnectionMonitorService } from './core/services/utils/connection-monitor.service';
import { ToastNotificationService } from './core/services/utils/toast-notification.service';
import { ThemeService } from './core/services/utils/theme.service';
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
  private toastSubscription?: Subscription;

  constructor(
    private authSessionService: AuthSessionService,
    private connectionMonitor: ConnectionMonitorService,
    private toastService: ToastNotificationService,
    private themeService: ThemeService,
    private router: Router
  ) {
    this.authSessionService.initializeSessionIfExists();

    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showNavbar.set(!event.url.includes('/login-developer'));
    });
  }

  ngOnInit(): void {
    
    this.themeService.initializeTheme();
    
    this.toastSubscription = this.toastService.toast$.subscribe(toastMessage => {
      this.toast?.show(toastMessage.message, toastMessage.type, toastMessage.duration);
    });
    this.connectionMonitor.onConnectionLost(() => {
      this.connectionModal?.open();
    });

    this.connectionMonitor.onConnectionRestored(() => {
      this.connectionModal?.close();
      this.toast?.show('Conexión restaurada exitosamente', 'success', 4000);
    });

    this.connectionMonitor.startMonitoring();
  }

  ngOnDestroy(): void {
    this.connectionMonitor.stopMonitoring();
    this.toastSubscription?.unsubscribe();
  }

  public onRetryConnection(): void {
    console.log('Se reintentará la conexión');
  }
}
