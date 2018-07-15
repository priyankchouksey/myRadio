import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { User, Provider } from './user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentuser: User;
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
          console.log(userdata);
          const user = new User(userdata.uid, true, userdata.displayName, '', '',
            userdata.email, userdata.photoURL, userdata.providerData[0].providerId);
            _self.currentuser = user;
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
    });
  }
  getProviderName() {
    let retVal: string;
    switch (this.currentUser.provider) {
      case Provider.GOOGLE:
        retVal = 'Google';
        break;
      case Provider.FACEBOOK:
        retVal = 'Facebook';
        break;
      case Provider.TWITTER:
        retVal = 'Twitter';
        break;
      case Provider.EMAIL:
        retVal = 'email';
        break;
    }
    return retVal;
  }
  constructor() { }
}
