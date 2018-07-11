import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { User } from './user';

@Injectable()
export class AuthService {
  private authState;
  private user: User;

  constructor(public afAuth: AngularFireAuth) {

    this.afAuth.authState.subscribe(data => {
      this.authState = data;
      });
    //   _self.user = new User(data.uid, true, data.displayName, '', '', data.email, data.photoURL);
    //   console.log(_self);
    // });
  }
  get isLoggedIn(): boolean {
    return this.authState !== null;
  }
  get userInfo() {
    const user: User = this.authState === null || this.authState === undefined ? null :
    new User(this.authState.uid, true, this.authState.displayName, '', '', this.authState.email, this.authState.photoURL);
    return user;
  }
  login() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    return this.afAuth.auth.signOut();
  }
}
