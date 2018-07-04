import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isUserLoggedIn = false;
  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit() {
  }
  signIn() {
    this.auth.login().then(() => {
      this.isUserLoggedIn = true;
      this.router.navigate(['myStations']);
    });
  }
  signOut() {
    this.auth.logout().then(() => {
      this.isUserLoggedIn = false;
      this.router.navigate(['home']);
    });
  }
  createStation() {
    this.router.navigate(['station']);
  }
  showMenu() {

  }
}
