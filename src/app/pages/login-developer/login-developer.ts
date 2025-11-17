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

  public onVerified(): void {
    const target = this.returnUrl || '/tests';
    this.router.navigateByUrl(target);
  }
}
