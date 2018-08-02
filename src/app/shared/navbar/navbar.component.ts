import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { User, Provider } from '../../core/user';
import { LoginComponent } from '../login/login.component';
import { UserService } from '../../core/user.service';
import { EventsService } from '../../core/events.service';
import { PrivacyComponent } from '../privacy/privacy.component';
import { TosComponent } from '../tos/tos.component';
import { ContactComponent } from '../contact/contact.component';

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
      if (!targetElement || !this.elRef) {
          return;
      }
      const clickedInside = this.elRef.nativeElement.contains(targetElement);
      if (!clickedInside) {
          this.showDraw = false;
      }
  }
  constructor(private auth: AuthService,
    public usrSrvc: UserService,
    private router: Router,
    private dialog: MatDialog,
    private evtSrvc: EventsService) { }

  ngOnInit() {
    if (!(this.usrSrvc.currentUser && this.usrSrvc.currentUser.loggedIn)) {
      this.usrSrvc.getCurrentUser().then(user => {
      }).catch(err => {
        console.log(err);
      });
    }
    this.showDraw = false;
    this.evtSrvc.subscribe('LOGIN_CLICKED').subscribe(() => {
      this.iconClick();
    });
    this.evtSrvc.subscribe('showprivacy').subscribe(() => {
      this.showDialog(PrivacyComponent);
    });
    this.evtSrvc.subscribe('showtos').subscribe(() => {
      this.showDialog(TosComponent);
    });
    this.evtSrvc.subscribe('contactus').subscribe(() => {
      this.sendMail();
    });
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
      this.usrSrvc.currentUser = null;
      this.router.navigate(['home']);
    });
  }
  createStation() {
    this.router.navigate(['station']);
  }
  onOptionClick(type: string) {
    switch (type) {
      case 'createstation':
        this.evtSrvc.publish('CREATE_STATION', null);
        break;
      case 'sharestation':
        this.evtSrvc.publish('SHARE_STATION', null);
        break;
      case 'manageshare':
        this.evtSrvc.publish('MANAGE_SHARE', null);
        break;
      case 'showguide':

        break;
      case 'signout':
        this.signOut();
        break;
      case 'privacypolicy':
        this.showDialog(PrivacyComponent);
        break;
      case 'tos':
        this.showDialog(TosComponent);
        break;
      case 'contactus':
        this.sendMail();
        // this.showDialog(ContactComponent);
        break;
    }
    this.showDraw = false;
  }
  private showDialog(component: any) {
    this.dialog.open(component, {
      autoFocus: false,
      disableClose: true
    });
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
  private sendMail() {
    const mailto_link = 'mailto:getintouch@myradio.live?subject=[Feedback]&body=Describe here';
    const win = window.open(mailto_link, '_blank');
    setTimeout(() => {
      win.close();
    }, 100);
  }
}
