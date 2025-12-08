import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { AuthCodeService } from '../../services/auth-code.service';
import { NgIcon,provideIcons } from "@ng-icons/core";
import{ionLogOutOutline} from '@ng-icons/ionicons';
@Component({
  selector: 'app-navbartool',
  imports: [Navbar, NgIcon],
  viewProviders:[provideIcons({ionLogOutOutline})],
  templateUrl: './navbartool.html',
  styleUrl: './navbartool.css',
})
export class Navbartool {

  constructor(private authCodeService: AuthCodeService) {}

  logout() {
    this.authCodeService.logoutAndRedirect();
  }
}
