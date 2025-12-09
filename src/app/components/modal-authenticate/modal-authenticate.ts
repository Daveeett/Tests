import { Component, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionSendOutline } from '@ng-icons/ionicons';
import { AuthService } from '../../core/services/Developer/auth.service';
import { AuthCodeService } from '../../services/auth-code.service';
import { ValidateCodeRequest } from '../../interfaces/Requests/Developer/validate-code-request';

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
    private authService: AuthService,
    private authCodeService: AuthCodeService
  ) {}

  /**
   * Open the modal and send authentication code
   */
  public open(email: string) {
    this.currentEmail = email;

    if (this.emailDisplayRef?.nativeElement) {
      this.emailDisplayRef.nativeElement.textContent = email;
    }

    this.resetUI();
    this.sendAuthenticationCode();
    this.modalRef.nativeElement.showModal();
  }

  /**
   * Reset UI state
   */
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

  /**
   * Send authentication code to user's email
   */
  private sendAuthenticationCode() {
    this.authService.sendAuthenticationCode({ EmailAddress: this.currentEmail }).subscribe({
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

  /**
   * Verify the authentication code entered by user
   */
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

    this.authService.verifyAuthenticationCode(request).subscribe({
      next: (response) => {
        if (response.result) {
          // Save code to localStorage so AuthGuard allows access
          this.authCodeService.saveAuthCode(code);
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

  /**
   * Close the modal
   */
  public cancel() {
    this.modalRef.nativeElement.close();
  }
}
