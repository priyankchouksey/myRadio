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
  register(credentials: any): any {
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
  }
  login(provider: Provider, data?: any) {
    let retVal: any;
    switch (provider) {
      case Provider.GOOGLE:
        retVal = this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        break;
      case Provider.EMAIL:
        retVal = this.afAuth.auth.signInWithEmailAndPassword(data.email, data.password);
        break;
      case Provider.FACEBOOK:
        retVal = this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
        break;
      case Provider.TWITTER:
        retVal = this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
        break;
    }
    return retVal;
  }
  logout() {
    return this.afAuth.auth.signOut();
  }
}
