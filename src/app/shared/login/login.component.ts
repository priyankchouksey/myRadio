import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { Provider } from '../../core/user';
import { UserService } from '../../core/user.service';
import { MatSnackBarRef, MatSnackBar } from '../../../../node_modules/@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoginMode = true;
  wrongpwdCount = 0;
  errorSnackBar: MatSnackBarRef<any>;

  @HostListener('window:resize', ['$event'])
    onResize(event?) {
      let width: string;
      if (window.innerWidth < 600 ) {
        width = '90%';
      } else {
        width = '60%';
      }
    this.dialogRef.updateSize(width);
  }
  constructor(
    public authService: AuthService,
    private usrSrvc: UserService,
    private router: Router,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginComponent>,
    private snackBarRef: MatSnackBar
  ) {
    this.createForm();
  }
  ngOnInit(): void {
    // window.onresize((ev) => {
    //   console.log(ev);
    //   return ev;
    // });
    let width: string;
    if (window.innerWidth < 600 ) {
      width = '90%';
    } else {
      width = '60%';
    }
    this.dialogRef.updateSize(width);
    this.isLoginMode = true;
  }
  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  tryFacebookLogin() {
    this.authService.login(Provider.FACEBOOK)
    .then(res => {
      this.postLogin(res);
    });
  }

  tryTwitterLogin() {
    this.authService.login(Provider.TWITTER)
    .then(res => {
      this.postLogin(res);
    });
  }

  tryGoogleLogin() {
    this.authService.login(Provider.GOOGLE)
    .then(res => {
      this.postLogin(res);
    });
  }

  tryLogin(value) {
    if (this.isLoginMode) {
      this.authService.login(Provider.EMAIL, value)
      .then(res => {
        this.postLogin(res);
      }, err => {
        this.ShowError(err);
      });
    } else {
      this.authService.register(value)
      .then(res => {
        this.postLogin(res);
      }, err => {
        console.log(err);
        this.ShowError(err);
      });
    }
  }

  closeDialog(isClosedCliecked: boolean) {
    this.dialogRef.close(isClosedCliecked);
  }
  private postLogin(res: any) {
    if (this.shouldRedirect()) {
      this.router.navigate(['myStations']);
    }
    this.closeDialog(false);
  }
  shouldRedirect(): boolean {
    return !this.router.url.includes('/shared/');
  }
  valueChanged() {
    if (this.errorSnackBar) {
      this.errorSnackBar.dismiss();
    }
  }
  private ShowError(error: any) {
    if (!error) { return ''; }
    let errorStr: string;
    let actionStr = 'DISMISS';
    switch (error.code) {
      case 'auth/invalid-email':
          errorStr = 'Invalid email.';
        break;
      case 'auth/user-not-found':
        errorStr = 'User not found, you may need to register.';
        actionStr = 'Register';
        break;
      case 'auth/wrong-password':
        this.wrongpwdCount++;
        errorStr = 'Incorrect Password';
        break;
      default:
        errorStr = error.message;
        break;
    }
    this.errorSnackBar = this.snackBarRef.open(errorStr, actionStr, {
      duration: 5000
    });
    this.errorSnackBar.afterDismissed().subscribe(data => {
      if (data  && actionStr === 'Register') {
        this.isLoginMode = false;
      }
    });
  }
  hintClick() {

  }
}
