import { Component, computed } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { AuthSessionService } from '../../core/services/auth/auth-session.service';
import { ThemeService } from '../../core/services/utils/theme.service';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { ionLogOutOutline, ionMoonOutline, ionSunnyOutline } from '@ng-icons/ionicons';

@Component({
  selector: 'app-navbartool',
  imports: [NgIcon, Navbar],
  viewProviders: [provideIcons({ ionLogOutOutline, ionMoonOutline, ionSunnyOutline })],
  templateUrl: './navbartool.html',
  styleUrl: './navbartool.css',
})
export class Navbartool {
  protected themeIcon = computed(() => 
    this.themeService.isDarkTheme() ? 'ionSunnyOutline' : 'ionMoonOutline'
  );

  protected themeLabel = computed(() => 
    this.themeService.isDarkTheme() ? 'Modo Claro' : 'Modo Oscuro'
  );

  constructor(
    private authSessionService: AuthSessionService,
    private themeService: ThemeService
  ) {}

  logout() {
    this.authSessionService.logoutAndRedirect();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
