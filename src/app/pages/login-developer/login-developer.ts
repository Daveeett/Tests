import { Component, ViewChild } from '@angular/core';
import { ModalAuthenticate } from '../../components/modal-authenticate/modal-authenticate';
import { DeveloperService } from '../../services/developer-service';
import { LoginDeveloperRequest } from '../../interfaces/Requests/Developer/login-developer-request';


@Component({
  selector: 'app-login-developer',
  imports: [ModalAuthenticate],
  templateUrl: './login-developer.html',
  styleUrl: './login-developer.css',
})
export class LoginDeveloper {
  @ViewChild('authModal') authModal!: ModalAuthenticate;

  showEmailError: boolean = false;

  constructor(private developerService: DeveloperService) {}

  public validateUser() {
    const email = (document.getElementById('emailaddress') as HTMLInputElement)?.value?.trim();

    if (!email) {
      this.showEmailError = true;
      return;
    }
    this.showEmailError = false;

    const request: LoginDeveloperRequest = { EmailAddress: email };

    this.developerService.validateUser(request).subscribe({
      next: (response) => {
        if (response.result) {
          console.log('Usuario verificado. Procediendo con la autenticación.');
          this.authModal.open(email);
        } else {
          this.showEmailError = true;
          console.error('Usuario no válido:', response.message);
        }
      },
      error: (error) => {
        this.showEmailError = true;
        console.error('Error al validar usuario:', error);
      }
    });
  }

 
}
