import { Injectable } from '@angular/core';
import { Station } from '../shared/station';
import { Share, ShareDoc, ShareStation } from '../shared/station-share';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { UserService } from '../core/user.service';
import { StationsService } from './stations.service';


@Injectable({
  providedIn: 'root'
})
export class ShareStationService {
  list: Array<Station> = new Array<Station>();
  shareCollection: AngularFirestoreCollection<any>;
  shareStationCollection: AngularFirestoreCollection<any>;
  userStationCollection: AngularFirestoreCollection<any>;

  constructor(private ngFs: AngularFirestore, private usrSrvc: UserService, private stnSrvc: StationsService) {
    this.shareCollection = ngFs.collection('shares');
    this.shareStationCollection = ngFs.collection('sharestations');
    this.userStationCollection = ngFs.collection('userstations');
  }

  add(station: Station) {
    const found = this.list ? this.list.findIndex(item => item.id === station.id) : -1;
    if (found < 0) {
      this.list.unshift(station);
    }
    station.addedtoshare = true;
  }
  remove(station: Station) {
    const found = this.list ? this.list.findIndex(item => item.id === station.id) : -1;
    if (found < 0) {
      this.list.splice(found);
    }
    station.addedtoshare = false;
  }
  getShareStationList() {
    return this.list;
  }
  saveShare(shareData: Share) {
    return new Promise((resolve, reject) => {
      try {
      const statData: any = {
        name: shareData.name
      };
      this.shareCollection.add(statData).then((value) => {
        shareData.stations.forEach(element => {
          const shareStationData: any = {stationid: element.id, shareid: value.id};
          this.shareStationCollection.add(shareStationData);
        });
        shareData.id = value.id;
        resolve('Success');
      });
      } catch (error) {
        reject(error);
      }
    });
  }
  getShare(shareID: string): Promise<Share> {
    console.log('reading shares');

    return new Promise((resolve, reject) => {
      this.ngFs.doc<ShareDoc>(`/shares/${shareID}`).ref.get().then(res => {
        const retVal: Share = new Share();
        const sdata: any = res.data();
        retVal.id = res.id;
        retVal.name = sdata.name;
        this.ngFs.collection('sharestations', queryRef => {
          let query: any = queryRef;
          query = query.where('shareid', '==', retVal.id);
          return query;
        }).ref.get().then(srres => {
          let stnCounter = srres.size;
          srres.forEach(doc => {
            const stnshrdata = doc.data();
            const id = stnshrdata.stationid;
            this.ngFs.doc(`/stations/${stnshrdata.stationid}`).ref.get().then(stndoc => {
              const stndata = stndoc.data();
              retVal.stations.push(new ShareStation({id, ...stndata}));
              stnCounter--;
              if (stnCounter === 0) {
                resolve(retVal);
              }
            });
          });
        });
      });
    });
  }
  importShare(shareData: Share) {
    return new Promise((resolve, reject) => {
      shareData.stations.forEach(element => {
        if (element.selected) {
          const stnRef = this.stnSrvc.getStation(element.id).ref;
          const saveData: any = {favourite: false,
            isplaying: false,
            playCount: 0,
            userid: this.usrSrvc.currentUser.id };
          saveData.stationRef = stnRef;
          this.userStationCollection.add(saveData);
        }
      });
      resolve();
    });
  }
}
