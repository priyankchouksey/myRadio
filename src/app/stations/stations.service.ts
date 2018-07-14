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
  user: User;

  constructor(private ngFs: AngularFirestore, private storage: AngularFireStorage, usrSrvc: UserService) {
    this.stationCollection = this.ngFs.collection('stations', ref => ref.orderBy('createdate', 'desc'));
    this.userStationCollection = this.ngFs.collection('userstations', ref => ref.orderBy('createdate', 'desc'));
    usrSrvc.getCurrentUser().then(user => {
      this.user =  user;
    });
   }
   getStations() {
     return this.myStations;
   }
   refreshStations(userID?: string) {
    this.ngFs.collection('userstations', queryRef => {
      let query: any = queryRef;
      query = query.where('userid', '==', this.user.id);
      return query;
    }).ref.get().then(res => {
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
      city: data.geo.city,
      state: data.geo.state,
      county: data.geo.country,
      playurl: data.playurl,
      logo: data.logo,
      assistantkeyword: data.assistKeyword,
      website: data.website,
      createdate: data.createdate,
      createdby: data.createdby,
      active: true
    };
    this.stationCollection.add(statData).then((value) => {
      // update user Station table
      const userStationData: any = {userid: data.createdby, favourite: false, isplaying: false, playCount: 0};
      userStationData.stationRef = value;
      this.userStationCollection.add(userStationData);
    });
   }

   delete(id: string) {
    return this.getStation(id).delete();
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
