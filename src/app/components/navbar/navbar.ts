import { Component ,computed} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/utils/theme.service';
import { AuthSessionService } from '../../core/services/auth/auth-session.service';
import { NgIcon } from "@ng-icons/core";
import { ionMenu, ionDocumentTextOutline, ionPeopleOutline, ionBusinessOutline, ionCardOutline, ionSettingsOutline, ionLogOutOutline, ionCloseOutline } from "@ng-icons/ionicons";
import { provideIcons } from "@ng-icons/core";
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgIcon],
  viewProviders: [provideIcons({ ionMenu, ionDocumentTextOutline, ionPeopleOutline, ionBusinessOutline, ionCardOutline, ionSettingsOutline, ionLogOutOutline, ionCloseOutline })],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {


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

}
