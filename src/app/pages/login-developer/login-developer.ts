import { Component, ViewChild } from '@angular/core';
import { ModalAuthenticate } from '../../components/modal-authenticate/modal-authenticate';
import { DeveloperService } from '../../services/developer-service';
import { LoginDeveloperRequest } from '../../interfaces/Requests/login-developer-request';

@Component({
  selector: 'app-login-developer',
  imports: [ModalAuthenticate],
  templateUrl: './login-developer.html',
  styleUrl: './login-developer.css',
})
export class LoginDeveloper {
  @ViewChild('authModal') authModal!: ModalAuthenticate;

  constructor(private developerService: DeveloperService){}


  public validateUser(){
    const email = (document.getElementById('emailaddress') as HTMLInputElement)?.value?.trim();
    if(!email){
      alert('Por favor ingresa un email válido.');
      return;
    }


    this.developerService.validateUser({ EmailAddress: email }).subscribe({
      next: (response) => {
        if(response.success) {
          console.log('Usuario verificado. Procediendo con la autenticación.');
          this.authModal.open(email);
        } else {
          alert('Usuario no válido');
        }
      },
      error: (error) => {
        console.error('Error al validar usuario:', error);
        alert('Error al validar usuario. Por favor intente nuevamente.');
      }
    })
        

    ;
  }
}
