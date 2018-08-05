import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, Query } from 'angularfire2/firestore';

import { Station, UserStation } from '../shared/station';
import { Action } from 'rxjs/internal/scheduler/Action';
import { map, retry } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import { User } from '../core/core.module';
import { AngularFireStorage } from 'angularfire2/storage';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../core/user.service';

@Injectable({
  providedIn: 'root'
})
export class StationsService {
  myStations: BehaviorSubject<Station> = new BehaviorSubject<Station>(null);

  stationCollection: AngularFirestoreCollection<Station>;
  userStationCollection: AngularFirestoreCollection<UserStation>;
  // user: User;

  constructor(private ngFs: AngularFirestore, private storage: AngularFireStorage, private usrSrvc: UserService) {
    this.stationCollection = this.ngFs.collection('stations', ref => ref.orderBy('createdate', 'desc'));
    this.userStationCollection = this.ngFs.collection('userstations', ref => ref.orderBy('createdate', 'desc'));
    // usrSrvc.getCurrentUser().then(user => {
    //   this.user =  user;
    // });
   }
   getStations(userID?: string) {
    return new Promise((resolve, reject) => {
      try {
        const retVal: Array<Station> = new Array<Station>();
        this.ngFs.collection('userstations').ref.where('userid', '==', this.usrSrvc.currentUser.id).get().then(res => {
          let stnCount = res.size;
          res.forEach(doc => {
            const usdata: any = doc.data();
            const usID = doc.id;
            if (usdata.stationRef) {
              usdata.stationRef.get().then(station => {
                const id = station.id;
                const sdata = station.data();
                retVal.push( new Station({id, usID, ...sdata, ...usdata}));
                stnCount--;
                if (stnCount === 0) {
                  resolve(retVal);
                }
              });
            }
          });
        });
      } catch (error) {
        reject(error);
      }
    });
   }
   refreshStations(userID?: string) {
      this.ngFs.collection('userstations').ref.where('userid', '==', this.usrSrvc.currentUser.id).get().then(res => {
        res.forEach(doc => {
        const usdata: any = doc.data();
        const usID = doc.id;
        if (usdata.stationRef) {
          usdata.stationRef.get().then(station => {
            const id = station.id;
            const sdata = station.data();
            this.myStations.next(new Station({id, usID, ...sdata, ...usdata}));
          });
        }
      });
    });
   }
   getStation(id: string) {
    return this.ngFs.doc<Station>(`/stations/${id}`);
   }
   getUserStation(id: string) {
     return this.ngFs.doc<any>(`/userstations/${id}`);
   }
   create(data: Station) {
    const statData: any = {
      name: data.name,
      frequency: data.frequency,
      city: data.geo.city ? data.geo.city : '' ,
      state: data.geo.state ? data.geo.state : '',
      county: data.geo.country ? data.geo.country : '',
      playurl: data.playurl,
      logo: data.logo,
      assistantkeyword: data.assistKeyword ? data.assistKeyword : '',
      website: data.website ? data.website : '',
      createdate: data.createdate,
      createdby: data.createdby,
      active: true
    };
    return new Promise((resolve, reject) => {

      this.stationCollection.add(statData).then((value) => {
        // update user Station table
        const userStationData: any = {userid: data.createdby, favourite: false, isplaying: false, playCount: 0};
        userStationData.stationRef = value;
        this.userStationCollection.add(userStationData).then(() => {
          resolve('Saved Successful...');
        })
        .catch(err => {
          reject({'title': 'Error while saving user station data', 'error': err});
        });
      })
      .catch(err => {
        reject({'title': 'Error while saving station data', 'error': err});
      });
    });
   }

  removeUserStation(station: Station, allUsers: boolean) {
    if (allUsers) {
      return new Promise<void>((resolve, reject) => {
        const ref = this.getStation(station.id).ref;
        this.ngFs.collection('userstations').ref.where('stationRef', '==', ref).get().then(res => {
          let recCount = res.size;
          res.forEach(doc => {
            doc.ref.delete();
            recCount--;
            if (recCount === 0) {
              resolve();
            }
          });
        });
      });
    } else {
      return this.getUserStation(station.userstatioid).delete();
    }
  }
  removeFromShare(station: Station, shareId?: string) {
    return new Promise<void>((resolve, reject) => {
      const ref = this.getStation(station.id).ref;
      this.ngFs.collection('sharestations').ref.where('stationRef', '==', ref).get().then(res => {
        let stnCount = res.size;
        res.forEach(doc => {
          const ssData: any = doc.data();
          if (shareId && ssData.shareId === shareId ) {
            doc.ref.delete();
          } else if (!shareId) {
            doc.ref.delete();
          }
          stnCount--;
          if (stnCount === 0) {
            resolve();
          }
        });
      })
      .catch(() => {
        reject();
      });
    });
  }
  delete(station: Station) {
    return new Promise<void>((resolve, reject) => {
      this.removeUserStation(station, true).then((val) => {
        this.removeFromShare(station).then(() => {
          this.getStation(station.id).delete().then(() => resolve()).catch(() => reject());
        })
        .catch(() => reject());
      })
      .catch(() => reject());
    });
  }

  update(data: Station) {
    const statData: any = {
      name: data.name,
      frequency: data.frequency,
      playurl: data.playurl,
    };
  return this.getStation(data.id).update(statData);
  }
   getNewID() {
     return this.ngFs.createId();
   }
   updateUserStation(data: Station) {
    const usData: any = {
      favourite: data.favourite,
      isplaying: data.playing
    };
    const doc = this.getUserStation(data.userstatioid);
    return doc.update(usData);
   }
}
