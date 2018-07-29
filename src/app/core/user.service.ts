import { Injectable, EventEmitter } from '@angular/core';
import * as firebase from 'firebase';
import { User, Provider } from './user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentuser: User;
  loginStatusChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  public set currentUser(value: User) {
    this.currentuser = value;
  }
  public get currentUser() {
    return this.currentuser;
  }
  getCurrentUser() {
    const _self = this;
    return new Promise<any>((resolve, reject) => {
      const retVal = firebase.auth().onAuthStateChanged(function(userdata) {
        if (userdata) {
          if (userdata.providerData[0].providerId === 'password' && !userdata.emailVerified) {
            reject({'code': 'auth/email-not-verified', 'message': 'Email not verified.'});
          } else {
            console.log(userdata);
            const user = new User(userdata.uid, true, userdata.displayName, '', '',
              userdata.email, userdata.photoURL, userdata.providerData[0].providerId);
              _self.currentuser = user;
              _self.loginStatusChange.emit(true);
            resolve(user);
          }
        } else {
          reject('No user logged in');
        }
      });
    });
  }
  constructor() { }
}
