import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { User, Provider } from '../../core/user';
import { LoginComponent } from '../login/login.component';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('drawer') elRef;
  showDraw: boolean;
  showingMe: boolean;
  authUser: User;
  loginDialog: MatDialogRef<LoginComponent>;
  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (this.showingMe) { return; }
      if (!targetElement) {
          return;
      }
      const clickedInside = this.elRef.nativeElement.contains(targetElement);
      if (!clickedInside) {
          this.showDraw = false;
      }
  }
  constructor(private auth: AuthService, public usrSrvc: UserService, private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    if (!(this.usrSrvc.currentUser && this.usrSrvc.currentUser.loggedIn)) {
      this.usrSrvc.getCurrentUser().then(user => {
      }).catch();
    }
    this.showDraw = false;
  }

  iconClick() {
    if (this.usrSrvc.currentUser && this.usrSrvc.currentUser.loggedIn) {
      this.toggleDrawer();
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
  onOptionClick(type: string) {
    switch (type) {
      case 'createstation':

        break;
      case 'sharestation':

        break;
      case 'showguide':

        break;
      case 'signout':
        this.signOut();
        break;
    }
  }
  private toggleDrawer () {
    this.showDraw = !this.showDraw;
    if (this.showDraw) {
      this.showingMe = true;
      // add interval so show click does not trigger hostlisner close;
      setInterval(() => {
        this.showingMe = false;
      }, 100);
    }
  }
}
