import { Component, ViewChild } from '@angular/core';
import { ModalAuthenticate } from '../../components/modal-authenticate/modal-authenticate';
import { DeveloperService } from '../../services/developer-service';
import { LoginDeveloperRequest } from '../../interfaces/Requests/Developer/login-developer-request';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthCodeService } from '../../services/auth-code.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  ionPersonCircleOutline} from '@ng-icons/ionicons';

@Component({
  selector: 'app-login-developer',
  imports: [ModalAuthenticate,NgIcon],
  viewProviders:[provideIcons({ionPersonCircleOutline })],
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
    private route: ActivatedRoute,
    private authCodeService: AuthCodeService
  ) {

    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  }

  //validar que el usuario existe(está dentro de los correos de desarrolladores)
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
          //abre el modal de autenticacion
          this.authModal.open(emailTrim);
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

  //si la autenticacion es correcta, se navega a login-users
  public onVerified(): void {
    this.authCodeService.startSessionTimer();
    const target = this.returnUrl || '/logs';
    console.log('[LoginDeveloper] Navigating to:', target);
    this.router.navigateByUrl(target);
  }
}
