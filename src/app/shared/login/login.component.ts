import { Component, OnInit, HostListener, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { Provider } from '../../core/user';
import { UserService } from '../../core/user.service';
import { MatSnackBarRef, MatSnackBar } from '../../../../node_modules/@angular/material';
import { PasswordValidator } from './password-validator';
import { PicUploaderComponent } from '../pic-uploader/pic-uploader.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  wrongpwdCount = 0;
  errorSnackBar: MatSnackBarRef<any>;
  newUser = {
    'logo': '',
    'fname': '',
    'lname': '',
    'email': '',
    'password': '',
    'repassword': ''
  };
  @ViewChild('userPic') picUploader: PicUploaderComponent;
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
    private snackBarRef: MatSnackBar,
    private zone: NgZone
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
    this.registerForm = this.fb.group({
      fname: ['', [Validators.required]],
      lname: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      repassword: ['', [Validators.required]]
    }, {
      validator: PasswordValidator.MatchPassword
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
        if (!res.user.emailVerified) {
          this.authService.logout();
          this.ShowError({'code': 'auth/email-not-verified', 'message': 'Email not verified.'});
        } else {
          this.postLogin(res);
        }
      })
      .catch(err => {
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
  registerUser() {
    this.authService.register(this.registerForm.value)
    .then(res => {
      if (res) {
        if (this.picUploader.imageSource && this.picUploader.imageSource !== '') {
          this.picUploader.saveImage('myPic').then(value => {
            const name  = this.registerForm.value.fname + (this.registerForm.value.lname ? ' ' + this.registerForm.value.lname : '');
            res.user.updateProfile({
              displayName: name,
              photoURL: value
            });
            res.user.sendEmailVerification().then(() => {
              this.snackBarRef.open('Verification email has been sent, verify and continue to login', 'DISMISS', { duration: 5000});
              this.isLoginMode = true;
            });
          })
          .catch(err => {
            this.snackBarRef.open('User created but error while saving Profile picture', 'DISMISS', { duration: 5000});
            this.isLoginMode = true;
          });
        } else {
          const name  = this.registerForm.value.fname + (this.registerForm.value.lname ? ' ' + this.registerForm.value.lname : '');
          res.user.updateProfile({
            displayName: name
          });
          res.user.sendEmailVerification().then(() => {
            this.snackBarRef.open('Verification email has been sent, verify and continue to login', 'DISMISS', { duration: 5000});
            this.isLoginMode = true;
          });
        }
      }
      // this.postLogin(res);
    }, err => {
      this.ShowError(err);
    });
  }
  resetPassword() {

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
      case 'auth/email-not-verified':
        this.wrongpwdCount++;
        errorStr = 'Email ID not verified, please verify.';
        break;
      case 'auth/email-already-in-use':
        errorStr = error.message;
        actionStr = 'Open Login';
        break;
      default:
        errorStr = error.message;
        break;
    }
    this.errorSnackBar = this.snackBarRef.open(errorStr, actionStr, {
      duration: 5000
    });
    this.errorSnackBar.afterDismissed().subscribe(data => {
      this.zone.run(() => {
        if (data.dismissedByAction  && actionStr === 'Register') {
          this.isLoginMode = false;
        }
        if (data.dismissedByAction && actionStr === 'Open Login') {
          this.isLoginMode = true;
        }
      });
    });
  }
}
