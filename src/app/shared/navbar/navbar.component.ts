import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { User } from '../../core/user';
import { LoginComponent } from '../login/login.component';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  authUser: User;
  loginDialog: MatDialogRef<LoginComponent>;
  constructor(private auth: AuthService, private usrSrvc: UserService, private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    if (!(this.usrSrvc.currentUser && this.usrSrvc.currentUser.loggedIn)) {
      this.usrSrvc.getCurrentUser().then(user => {

      }).catch();
    }
  }

  iconClick() {
    if (this.usrSrvc.currentUser && this.usrSrvc.currentUser.loggedIn) {
      // show nav
      this.auth.logout().then(() => {
        console.log('logged out.');
      });
    } else {
      this.loginDialog = this.dialog.open(LoginComponent);
    }
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
