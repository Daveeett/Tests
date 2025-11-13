import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ping } from '../../services/ping';
import { AuthCodeService } from '../../services/auth-code.service';
import { interval, Subscription } from 'rxjs';
import { Alert } from "../../shared/alert/alert";

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
    private authCodeService: AuthCodeService
  ) {}

  ngOnInit() {
    this.updateRemainingTime();
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateRemainingTime();
    });
  }
  
  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }

  private updateRemainingTime() {
    this.remainingTime = this.authCodeService.getRemainingTime();
  }

  public Ping() {
    if (!this.authCodeService.hasValidAuthCode()) {
      console.error('Código expirado, inicia sesión nuevamente.');
      alert('Tu sesión ha expirado, inicia sesión denuevo.');
      return;
    }

    this.testService.ping()
      .subscribe({
        next: (response) => {
          console.log(response.data);
          if (!response.result) {
            console.error('Error:', response.message);
          }
        },
        error: (error) => {
          console.error('Error en Ping:', error);
        }
      });
  }
}