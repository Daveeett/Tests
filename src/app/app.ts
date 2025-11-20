import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthCodeService } from './services/auth-code.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('test');

  constructor(private authCodeService: AuthCodeService) {
    this.authCodeService.initializeSessionIfExists();
  }
}
