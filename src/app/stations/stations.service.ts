import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, Query } from 'angularfire2/firestore';

import { Station, UserStation } from '../shared/station';
import { Action } from 'rxjs/internal/scheduler/Action';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import { User } from '../core/core.module';
import { AngularFireStorage } from 'angularfire2/storage';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StationsService {
  myStations: BehaviorSubject<Station> = new BehaviorSubject<Station>(null);

  stationCollection: AngularFirestoreCollection<Station>;
  userStationCollection: AngularFirestoreCollection<UserStation>;
  user: User;

  constructor(private ngFs: AngularFirestore, private storage: AngularFireStorage, private auth: AuthService) {
    this.stationCollection = this.ngFs.collection('stations', ref => ref.orderBy('createdate', 'desc'));
    this.userStationCollection = this.ngFs.collection('userstations', ref => ref.orderBy('createdate', 'desc'));
    this.user = this.auth.userInfo;
   }
   getStations() {
     return this.myStations;
   }
  //  getmyStations(userID: string) {
  // return this.ngFs.collection('userstations',
  //   queryRef => queryRef.where('userid', '==', userID))
  //   .snapshotChanges().map(.pipe(map(actions => {
  //     return actions.map(action => {
  //       console.log(action.payload.doc.data());
  //       const usdata = action.payload.doc.data();
  //       const usID = action.payload.doc.id;
  //       return usdata.stationRef.get().then(res => {
  //         const id = res.id;
  //         const sdata = res.data();
  //         console.log({id, usID, ...sdata});
  //         return {id, usID, ...sdata};
  //       });
  //       // const id = item.payload.doc.id;
  //       // return {id, ...data};
  //     }).;
  //   }));
  //  }
   refreshStations(userID: string) {
    // this.myStations = new Array<Station>();
    // const data = this.ngFs.collection('userstations', queryRef => {
    //     let query: any = queryRef;
    //     query = query.where('userid', '==', userID);
    //     return query;
    //   }).snapshotChanges();
    // data.subscribe((items) => {
    //   console.log(items);
    // });
    // return null;

    // return this.ngFs.collection('userstations', queryRef => {
    //   let query: any = queryRef;
    //   query = query.where('userid', '==', userID);
    //   return query;
    // }).snapshotChanges().pipe(map(actions => {
    //   return actions.map(item => {
    //     console.log(item.payload.doc.data());
    //     const usdata = item.payload.doc.data();
    //     const usID = item.payload.doc.id;
    //     return usdata.stationRef.get().then(res => {
    //       const id = res.id;
    //       const sdata = res.data();
    //       console.log({id, usID, ...sdata});
    //       return {id, usID, ...sdata};
    //     }).pipe((x) => x);
    //     // const id = item.payload.doc.id;
    //     // return {id, ...data};
    //   });
    // }));
    this.ngFs.collection('userstations', queryRef => {
      let query: any = queryRef;
      query = query.where('userid', '==', userID);
      return query;
    }).snapshotChanges().pipe(map(actions => {
      return actions.map(item => {
        console.log(item.payload.doc.data());
        const usdata: any = item.payload.doc.data();
        const usID = item.payload.doc.id;
        usdata.stationRef.get().then(res => {
          const id = res.id;
          const sdata = res.data();
          console.log({id, usID, ...sdata});
          this.myStations.next( {id, usID, ...sdata});
        });
        // const id = item.payload.doc.id;
        // return {id, ...data};
      });
    }));
   }
   getStation(id: string) {
    return this.ngFs.doc<Station>('/stations/${id}');
   }
   create(data: Station) {
    const statData: any = {
      name: data.name,
      frequency: data.frequency,
      city: data.city,
      state: data.state,
      county: data.country,
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
       playurl: data.playurl,
      };
    return this.getStation(data.id).update(statData);
   }
   getNewID() {
     return this.ngFs.createId();
   }
}
