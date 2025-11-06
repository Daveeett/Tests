import { Component } from '@angular/core';
import { Authenticate } from '../../components/authenticate/authenticate';

@Component({
  selector: 'app-login-developer',
  imports: [Authenticate],
  templateUrl: './login-developer.html',
  styleUrl: './login-developer.css',
})
export class LoginDeveloper {
  constructor(){}


  public Authenticate(){
    //const string 

  }

}
