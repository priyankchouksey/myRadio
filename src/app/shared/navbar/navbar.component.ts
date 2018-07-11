import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { User } from '../../core/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  authUser: User;
  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit() {
  }
  signIn() {
    this.auth.login().then(() => {
      this.authUser = this.auth.userInfo;
      this.router.navigate(['myStations']);
    });
  }
  signOut() {
    this.auth.logout().then(() => {
      this.router.navigate(['home']);
    });
  }
  createStation() {
    this.router.navigate(['station']);
  }
  showMenu() {

  }
}
