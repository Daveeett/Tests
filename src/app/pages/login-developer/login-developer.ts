import { Component, ViewChild } from '@angular/core';
import { ModalAuthenticate } from '../../components/modal-authenticate/modal-authenticate';
import { DeveloperService } from '../../services/developer-service';
import { LoginDeveloperRequest } from '../../interfaces/Requests/Developer/login-developer-request';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-developer',
  imports: [ModalAuthenticate],
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
    private developerService: DeveloperService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // capturar returnUrl (si existe) desde query params
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  }

  public validateUser(): void {
    this.showError = false;
    const emailTrim = this.email?.trim();
    if (!emailTrim) {
      this.showError = true;
      return;
    }

    this.loading = true;
    const payload: LoginDeveloperRequest = { EmailAddress: emailTrim };

    this.developerService.validateUser(payload).subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp && resp.result) {
          // solicitar envío de código y abrir modal (la apertura y verificación guardarán el código)
          this.developerService.sendAuthenticationCode(payload).subscribe({
            next: () => this.authModal.open(emailTrim),
            error: (err) => {
              console.error('sendAuthenticationCode error', err);
              this.showError = true;
            }
          });
        } else {
          this.showError = true;
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('validateUser error', err);
        this.showError = true;
      }
    });
  }

  // llamado cuando el modal emite verified
  public onVerified(): void {
    // al verificarse, redirigir al returnUrl si existe o a la página por defecto
    const target = this.returnUrl || '/';
    this.router.navigateByUrl(target);
  }
}
