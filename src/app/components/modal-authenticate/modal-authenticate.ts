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

  private expectedCode: string = '';

  constructor(private developerService:DeveloperService){}

  public open(email: string, ){
    if (this.emailDisplayRef && this.emailDisplayRef.nativeElement) {
      this.emailDisplayRef.nativeElement.textContent = email;
    }
    // reset UI
    const errorEl = this.modalRef.nativeElement.querySelector('#codeError');
    if (errorEl) { errorEl.classList.add('hidden'); }

    // limpiar input
    const input = this.modalRef.nativeElement.querySelector('#authCode') as HTMLInputElement;
    if (input) { input.value = ''; }
 
    // Mostrar modal
    this.modalRef.nativeElement.showModal();
  }

  public verify(){
   const input = this.modalRef.nativeElement.querySelector('#authCode') as HTMLInputElement;
    const val = input?.value?.trim() || '';
    const errorEl = this.modalRef.nativeElement.querySelector('#codeError') as HTMLElement;
    
    if(val === this.expectedCode){
      this.modalRef.nativeElement.close();
      this.verified.emit();
    } else {
      if (errorEl) { errorEl.classList.remove('hidden'); }
    } 
  } 

  public cancel(){
    this.modalRef.nativeElement.close();
  }
}
