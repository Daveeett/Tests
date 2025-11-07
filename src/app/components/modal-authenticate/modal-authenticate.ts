import { Component, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';

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

  private expectedCode: string = '';

  constructor(){}

  // Abre el dialog y muestra el email; guarda el código esperado
  public open(email: string, code: string){
   /*  this.expectedCode = code;
    if (this.emailDisplayRef && this.emailDisplayRef.nativeElement) {
      this.emailDisplayRef.nativeElement.textContent = email;
    }
    // reset UI
    const errorEl = this.modalRef.nativeElement.querySelector('#codeError');
    if (errorEl) { errorEl.classList.add('hidden'); }

    // limpiar input
    const input = this.modalRef.nativeElement.querySelector('#authCode') as HTMLInputElement;
    if (input) { input.value = ''; }
 */
    // Mostrar modal
    this.modalRef.nativeElement.showModal();
  }

  public verify(){
   /*  const input = this.modalRef.nativeElement.querySelector('#authCode') as HTMLInputElement;
    const val = input?.value?.trim() || '';
    const errorEl = this.modalRef.nativeElement.querySelector('#codeError') as HTMLElement;

    if(val === this.expectedCode){
      // verificación correcta
      this.modalRef.nativeElement.close();
      this.verified.emit();
    } else {
      // mostrar mensaje de error
      if (errorEl) { errorEl.classList.remove('hidden'); }
    } */
  } 

  public cancel(){
    this.modalRef.nativeElement.close();
  }
}
