import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionPersonCircleOutline } from '@ng-icons/ionicons';
import { AuthApiService } from '../../core/services/auth/auth-api.service';
import { AuthSessionService } from '../../core/services/auth/auth-session.service';
import { LoginDeveloperRequest } from '../../interfaces/Requests/Developer/login-developer-request';
import { ModalAuthenticate } from '../../components/login/modal-authenticate/modal-authenticate';
@Component({
  selector: 'app-login-developer',
  imports: [ NgIcon,ModalAuthenticate],
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
    private authApiService: AuthApiService,
    private router: Router,
    private route: ActivatedRoute,
    private authSessionService: AuthSessionService
  ) {
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

    this.authApiService.validateUser(payload).subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp && resp.result) {
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

  public onVerified(): void {
    this.authSessionService.startSessionTimer();
    const target = this.returnUrl || '/logs';
    this.router.navigateByUrl(target);
  }
}
