import { Component, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { DeveloperService } from '../../services/developer-service';
import { AuthCodeService } from '../../services/auth-code.service';
import { ValidateCodeRequest } from '../../interfaces/Requests/Developer/validate-code-request';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  ionSendOutline} from '@ng-icons/ionicons';

@Component({
  selector: 'app-modal-authenticate',
  imports: [NgIcon],
  viewProviders:[provideIcons({ionSendOutline })],
  templateUrl: './modal-authenticate.html',
  styleUrl: './modal-authenticate.css',
})
export class ModalAuthenticate {
  @ViewChild('modal') modalRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('emailDisplay') emailDisplayRef!: ElementRef<HTMLElement>;
  @Output() verified = new EventEmitter<void>();

  private currentEmail: string = '';

  constructor(private developerService: DeveloperService, private authCodeService: AuthCodeService) {}

  //Abre el modal
  public open(email: string) {
    this.currentEmail = email;

    if (this.emailDisplayRef?.nativeElement) {
      this.emailDisplayRef.nativeElement.textContent = email;
    }

    this.resetUI();
    this.sendAuthenticationCode();
    this.modalRef.nativeElement.showModal();
  }

  //restablece la ui
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

  //envia el codigo de autenticacion
  private sendAuthenticationCode() {
    this.developerService.sendAuthenticationCode({ EmailAddress: this.currentEmail })
      .subscribe({
        next: (response) => {
          console.log("Code Sended");
          if (!response.result) {
            console.error('Error sending authentication code:', response.message);
          }
        },
        error: (error) => {
          console.error('Error sending authentication code:', error);
        }
      });
  }

  //Verifica el codigo de autenticacion
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

    this.developerService.verifyAuthenticationCode(request)
      .subscribe({
        next: (response) => {
          if (response.result) {
            console.log("Verification Success");
            // Guardar código en localStorage para que AuthGuard permita el acceso
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
        }
      });
  }

  //Cierra el modal
  public cancel() {
    this.modalRef.nativeElement.close();
  }
}

