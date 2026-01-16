import { Component, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionSendOutline } from '@ng-icons/ionicons';
import { AuthSessionService } from '../../../core/services/auth/auth-session.service';
import { ValidateCodeRequest } from '../../../interfaces/Requests/Developer/validate-code-request';
import { AuthApiService } from '../../../core/services/auth/auth-api.service';
@Component({
  selector: 'app-modal-authenticate',
  imports: [NgIcon],
  viewProviders: [provideIcons({ ionSendOutline })],
  templateUrl: './modal-authenticate.html',
  styleUrl: './modal-authenticate.css',
})
export class ModalAuthenticate {
  @ViewChild('modal') modalRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('emailDisplay') emailDisplayRef!: ElementRef<HTMLElement>;
  @Output() verified = new EventEmitter<void>();

  private currentEmail: string = '';

  constructor(
    private authApiService: AuthApiService,
    private authSessionService: AuthSessionService
  ) {}

  public open(email: string) {
    this.currentEmail = email;

    if (this.emailDisplayRef?.nativeElement) {
      this.emailDisplayRef.nativeElement.textContent = email;
    }

    this.resetUI();
    this.sendAuthenticationCode();
    this.modalRef.nativeElement.showModal();
  }

  private resetUI() {
    const errorEl = this.modalRef.nativeElement.querySelector('#codeError');
    if (errorEl) {
      errorEl.classList.add('hidden');
    }

    const input = this.modalRef.nativeElement.querySelector('#authCode') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  private sendAuthenticationCode() {
    this.authApiService.sendAuthenticationCode({ EmailAddress: this.currentEmail }).subscribe({
      next: (response) => {
        if (!response.result) {
          console.error('Error sending authentication code:', response.message);
        }
      },
      error: (error) => {
        console.error('Error sending authentication code:', error);
      },
    });
  }

  public verify() {
    const input = this.modalRef.nativeElement.querySelector('#authCode') as HTMLInputElement;
    const code = input?.value?.trim() || '';
    const errorEl = this.modalRef.nativeElement.querySelector('#codeError');

    if (!code) {
      errorEl?.classList.remove('hidden');
      return;
    }

    const request: ValidateCodeRequest = {
      AuthenticationCode: code,
    };

    this.authApiService.verifyAuthenticationCode(request).subscribe({
      next: (response) => {
        if (response.result) {
          this.authSessionService.saveAuthCode(code);
          this.modalRef.nativeElement.close();
          this.verified.emit();
        } else {
          errorEl?.classList.remove('hidden');
        }
      },
      error: (error) => {
        console.error('Error verifying code:', error);
        errorEl?.classList.remove('hidden');
      },
    });
  }

  public cancel() {
    this.modalRef.nativeElement.close();
  }
}
