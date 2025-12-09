import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionPersonCircleOutline } from '@ng-icons/ionicons';
import { ModalAuthenticate } from '../../components/modal-authenticate/modal-authenticate';
import { AuthService } from '../../core/services/Developer/auth.service';
import { AuthCodeService } from '../../services/auth-code.service';
import { LoginDeveloperRequest } from '../../interfaces/Requests/Developer/login-developer-request';

@Component({
  selector: 'app-login-developer',
  imports: [ModalAuthenticate, NgIcon],
  viewProviders: [provideIcons({ ionPersonCircleOutline })],
  templateUrl: './login-developer.html',
  styleUrl: './login-developer.css',
})
export class LoginDeveloper {
  @ViewChild('authModal') authModal!: ModalAuthenticate;

  email: string = '';
  loading = false;
  showError = false;

  private returnUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private authCodeService: AuthCodeService
  ) {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  }

  // Valida que el usuario exista (esté en la lista de emails de desarrolladores)
  public validateUser(): void {
    this.showError = false;
    const emailTrim = this.email?.trim();
    
    if (!emailTrim) {
      this.showError = true;
      return;
    }

    this.loading = true;
    const payload: LoginDeveloperRequest = { EmailAddress: emailTrim };

    this.authService.validateUser(payload).subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp && resp.result) {
          // Abre el modal de autenticación
          this.authModal.open(emailTrim);
        } else {
          this.showError = true;
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('validateUser error', err);
        this.showError = true;
      },
    });
  }

  // Maneja la autenticación exitosa - navega a la página objetivo
  public onVerified(): void {
    this.authCodeService.startSessionTimer();
    const target = this.returnUrl || '/logs';
    this.router.navigateByUrl(target);
  }
}
