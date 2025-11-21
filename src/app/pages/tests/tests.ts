import { Component, OnDestroy, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Ping } from '../../services/ping';
import { AuthCodeService } from '../../services/auth-code.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-tests',
  imports: [],
  templateUrl: './tests.html',
  styleUrl: './tests.css',
})
export class Tests implements OnInit, OnDestroy {
  remainingTime: number = 0;
  private timerSubscription?: Subscription;

  constructor(
    private testService: Ping,
    private authCodeService: AuthCodeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateRemainingTime();
      this.timerSubscription = interval(1000).subscribe(() => {
        this.updateRemainingTime();
      });
    }
  }
  

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }

  //actualizar el tiempo restante
  private updateRemainingTime() {
    this.remainingTime = this.authCodeService.getRemainingTime();
  }

  //hacer ping de prueba
  public Ping() {
    if (!this.authCodeService.hasValidAuthCode()) {
      console.error('Código expirado, inicia sesión nuevamente.');
      alert('Tu sesión ha expirado, inicia sesión denuevo.');
      return;
    }

    this.testService.ping()
      .subscribe({
        next: (response) => {
          console.log(response.data)
          if (!response.result) {
            console.error('Not pong:(', response.message);
          }
        },
        error: (error) => {
          console.error('Error', error);
        }
      });
  }
  
  //cerrar sesion
  public logout(): void {
    this.authCodeService.logoutAndRedirect();
  }

}
