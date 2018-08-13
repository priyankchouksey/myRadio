import { Injectable, EventEmitter } from '@angular/core';
import * as firebase from 'firebase';
import { User, Provider, UserPrefrences } from './user';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentuser: User;
  userPref: UserPrefrences;
  loginStatusChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  userPrefChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  constructor(private ngFs: AngularFirestore) {

  }
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
              _self.getUserPrefDoc().ref.get().then(res => {
                const perfID = res.id;
                const perfData = res.data();
                _self.currentuser.userPreferences = new UserPrefrences({id: perfID, ...perfData});
                resolve(user);
              });
            }
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  saveUserPref(data: any) {
    const perfData: any = {};
    const changed: string[] = new Array<string>();
    if (data.autoplay) {
      perfData.playlastplayed = data.playlastplayed;
      changed.push('playlastplayed');
    }
    if (data.groupby) {
      perfData.groupby = data.groupby;
      changed.push('groupby');
    }
    if (data.laststation) {
      perfData.laststation = data.laststation;
      changed.push('lastplayed');
    }
    this.ngFs.collection('usersettings').doc(this.currentuser.id).set(perfData).then(() => {
      this.currentuser.userPreferences.playlastplayed = data.autoplay;
      this.currentuser.userPreferences.groupby = data.groupby;
      this.currentuser.userPreferences.laststation = data.laststation;
      this.userPrefChange.emit(changed);

    });
  }
  private getUserPrefDoc() {
    return this.ngFs.doc<UserPrefrences>(`usersettings/${this.currentuser.id}`);
  }
}
