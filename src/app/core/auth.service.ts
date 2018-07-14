import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { User, Provider } from './user';

@Injectable()
export class AuthService {
  private authState;
  private user: User;

  constructor(public afAuth: AngularFireAuth) {

    this.afAuth.authState.subscribe(data => {
      this.authState = data;
      });
  }
  get isLoggedIn(): boolean {
    return this.authState !== null;
  }
  login(provider?: Provider, data?: any) {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    return this.afAuth.auth.signOut();
  }
}
