import { Component, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { DeveloperService } from '../../services/developer-service';


@Component({
  selector: 'app-modal-authenticate',
  imports: [],
  templateUrl: './modal-authenticate.html',
  styleUrl: './modal-authenticate.css',
})
export class ModalAuthenticate {
  @ViewChild('modal') modalRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('emailDisplay') emailDisplayRef!: ElementRef<HTMLElement>;
  @Output() verified = new EventEmitter<void>();

  private currentEmail: string = '';

  constructor(private developerService: DeveloperService) {}

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
    this.developerService.sendAuthenticationCode(this.currentEmail)
      .subscribe({
        next: (response) => {
          if (!response.result) {
            console.error('Error sending authentication code:', response.message);
          }
        },
        error: (error) => {
          console.error('Error sending authentication code:', error);
        }
      });
  }

  public verify() {
    const input = this.modalRef.nativeElement.querySelector('#authCode') as HTMLInputElement;
    const code = input?.value?.trim() || '';
    const errorEl = this.modalRef.nativeElement.querySelector('#codeError');

    this.developerService.verifyAuthenticationCode(this.currentEmail, code)
      .subscribe({
        next: (response) => {
          if (response.result) {
            this.modalRef.nativeElement.close();
            this.verified.emit();
          } else {
            errorEl?.classList.remove('hidden');
          }
        },
        error: (error) => {
          console.error('Error verifying code:', error);
          errorEl?.classList.remove('hidden');
        }
      });
  }

  public cancel() {
    this.modalRef.nativeElement.close();
  }
}import { from } from 'rxjs';

