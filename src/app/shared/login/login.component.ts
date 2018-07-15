import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { Provider } from '../../core/user';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  loginForm: FormGroup;
  isLoginMode: true;

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
    private dialogRef: MatDialogRef<LoginComponent>
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
      email: ['', Validators.required ],
      password: ['', Validators.required]
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
    this.authService.login(Provider.EMAIL, value)
    .then(res => {
      this.postLogin(res);
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
    });
  }
  closeDialog(isClosedCliecked: boolean) {
    this.dialogRef.close(isClosedCliecked);
  }
  private postLogin(res: any) {
    this.router.navigate(['myStations']);
    this.closeDialog(false);
  }
}
