import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from "@ng-icons/core";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgIcon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

}
