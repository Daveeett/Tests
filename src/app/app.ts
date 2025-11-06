import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginDeveloper } from './pages/login-developer/login-developer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,LoginDeveloper],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('test');
}
