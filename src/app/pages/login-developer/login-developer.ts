import { Component, ViewChild } from '@angular/core';
import { ModalAuthenticate } from '../../components/modal-authenticate/modal-authenticate';

@Component({
  selector: 'app-login-developer',
  imports: [ModalAuthenticate],
  templateUrl: './login-developer.html',
  styleUrl: './login-developer.css',
})
export class LoginDeveloper {
  @ViewChild('authModal') authModal!: ModalAuthenticate;

  constructor(){}

  public Authenticate(){
    const email = (document.getElementById('emailaddress') as HTMLInputElement)?.value?.trim();
    if(!email){
      // Mensaje simple para desarrollo
      alert('Por favor ingresa un email válido.');
      return;
    }

    // Genera un código de 6 dígitos (simulación de envío por correo)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Código enviado:', code); // para pruebas en desarrollo

    // Abre el modal y pasa email + código esperado
    this.authModal.open(email, code);
  }

  public onVerified(){
    // Aquí realiza la acción final de inicio de sesión (redirigir, token, etc.)
    console.log('Usuario verificado. Procediendo con inicio de sesión.');
    // ... añadir lógica real de login ...
  }
}
