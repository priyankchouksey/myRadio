import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
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
import { PreferencesComponent } from '../../core/preferences/preferences.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  @ViewChild('drawer') elRef;
  @ViewChild('searchBar') elSearchbarRef;
  showDraw: boolean;
  showSearch: boolean;
  showingMe: boolean;
  authUser: User;
  loginDialog: MatDialogRef<LoginComponent>;
  searchValue: string;
  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (this.showingMe) { return; }
      if (!targetElement || !this.elRef || !this.elSearchbarRef) {
          return;
      }
      if (this.showDraw) {
        const clickedInside = this.elRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
          this.showDraw = false;
        }
      } else if (this.showSearch) {
        const clickedInside = this.elSearchbarRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
          this.showSearch = false;
        }
      }
  }
  @HostListener('document:keyup', ['$event', '$event.target'])
  handleKeyboardEvent(event: KeyboardEvent, targetElement: HTMLElement) {
    if (!this.showSearch) {return; }
    if (event.keyCode === 27) { // Esc key
      this.onClearSearch();
    } else if (event.keyCode === 13) { // Return key
      this.onSearch();
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
  ngOnDestroy(): void {
    this.evtSrvc.unSubscribe('LOGIN_CLICKED');
    this.evtSrvc.unSubscribe('showprivacy');
    this.evtSrvc.unSubscribe('showtos');
    this.evtSrvc.unSubscribe('contactus');
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
      case 'preferences':
        this.showDialog(PreferencesComponent);
        break;
      case 'showguide':
        window.open(location.origin + '/guide.html', '_blank');
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
  onClearSearch() {
    this.searchValue = null;
    this.onSearch();
  }
  onSearch() {
    this.evtSrvc.publish('SEARCH', this.searchValue);
    this.showSearch = false;
    console.log(this.searchValue);
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
  private toggleSearch () {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
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
