import { Injectable } from '@angular/core';
import { Station } from '../shared/station';
import { Share, ShareDoc, ShareStation } from '../shared/station-share';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { UserService } from '../core/user.service';
import { StationsService } from './stations.service';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class ShareStationService {
  list: Array<ShareStation> = new Array<ShareStation>();
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
      const shr: ShareStation = new ShareStation();
      _.extend(shr, station);
      this.list.unshift(shr);
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
  // saveShare(shareData: Share) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //     const statData: any = {
  //       name: shareData.name
  //     };
  //     this.shareCollection.add(statData).then((value) => {
  //       shareData.stations.forEach(element => {
  //         const shareStationData: any = {stationid: element.id, shareid: value.id};
  //         this.shareStationCollection.add(shareStationData);
  //       });
  //       shareData.id = value.id;
  //       resolve('Success');
  //     });
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // }
  saveShare(shareData: Share) {
    return new Promise((resolve, reject) => {
      try {
      const statData: any = {
        name: shareData.name,
        createdate: new Date(Date.now()),
        importcount: 0,
        userid: this.usrSrvc.currentUser.id
      };
      this.shareCollection.add(statData).then((value) => {
        shareData.stations.forEach(element => {
          if (element.selected) {
            const shareStationData: any = {shareid: value.id, importcount: 0};
            shareStationData.stationRef = this.ngFs.doc<Station>(`/stations/${element.id}`).ref;
            this.shareStationCollection.add(shareStationData);
          }
        });
        shareData.id = value.id;
        resolve('Success');
      });
      } catch (error) {
        reject(error);
      }
    });
  }
  getShares() {
    return new Promise((resolve, reject) => {
      try {
          const retVal: Array<Share> = new Array<Share>();
          this.shareCollection.ref.where('userid', '==', this.usrSrvc.currentUser.id).get().then(res => {
            let shareCount = res.size;
            res.forEach(shareDoc => {
              const shrid = shareDoc.id;
              const shrdata: any = shareDoc.data();
              const retData: Share = new Share({id: shrid, ...shrdata});
              this.shareStationCollection.ref.where('shareid', '==', shrid).get().then(shrstncol => {
                let stationCount = shrstncol.size;
                shrstncol.forEach(shrstnDoc => {
                  const shrstndata = shrstnDoc.data();
                  if (shrstndata.stationRef) {
                    shrstndata.stationRef.get().then(stndoc => {
                      const stnid = stndoc.id;
                      const stndata = stndoc.data();
                      const newStation = new ShareStation({stnid, ...stndata});
                      retData.stations.push(newStation);
                      stationCount--;
                      if (stationCount === 0) {
                        retVal.push(retData);
                        shareCount--;
                        if (shareCount === 0) {
                          resolve(retVal);
                        }
                      }
                    });
                  }
                });
              });
            });
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  getShare(shareID: string): Promise<Share> {
    console.log('reading shares');

    return new Promise((resolve, reject) => {
      this.getMyStationsList().then(existingStations => {
        this.ngFs.doc<ShareDoc>(`/shares/${shareID}`).ref.get().then(res => {
          const retVal: Share = new Share();
          const sdata: any = res.data();
          retVal.id = res.id;
          retVal.name = sdata.name;
          this.ngFs.collection('sharestations').ref.where('shareid', '==', retVal.id).get().then(srres => {
            let stnCounter = srres.size;
            srres.forEach(doc => {
              const stnshrdata = doc.data();
              stnshrdata.stationRef.get().then(stndoc => {
                const id = stndoc.id;
                const stndata = stndoc.data();
                const newStation = new ShareStation({id, ...stndata});
                if (existingStations.indexOf(id) >= 0) {
                  newStation.alreadyexists = true;
                  newStation.selected = false;
                }
                retVal.stations.push(newStation);
                stnCounter--;
                if (stnCounter === 0) {
                  resolve(retVal);
                }
              });
            });
          });
        });
      });
    });
  }
  deleteShare(id: string) {
    return new Promise((res, rej) => {
      try {
        this.ngFs.collection('sharestations').ref.where('shareid', '==', id).get().then(srres => {
          let stnCounter = srres.size;
          srres.forEach(doc => {
            this.ngFs.doc(`/sharestations/${doc.id}`).delete();
            stnCounter--;
            if (stnCounter === 0) {
              this.ngFs.doc(`/shares/${id}`).delete();
              res('success');
            }
          });
        });
      } catch (error) {
        rej(error);
      }
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
      // this.updateImportCount(shareData.id);
      resolve();
    });
  }
  updateImportCount(id: string) {
    const ref = this.ngFs.doc(`shares/${id}`).snapshotChanges();
    ref.subscribe(value => {

    });
  }
  private getMyStationsList() {
    return new Promise<Array<string>>((resolve, reject) => {
      const retVal: string[] = new Array<string>();
      this.ngFs.collection('userstations').ref.where('userid', '==', this.usrSrvc.currentUser.id).get().then(res => {
        if (res.size > 0) {
          let stnCounter = res.size;
          res.forEach(element => {
            const usData = element.data();
            retVal.push(usData.stationRef.id);
            stnCounter--;
            if (stnCounter === 0) {
              resolve(retVal);
            }
          });
        } else {
          resolve(retVal);
        }

      });
    });
  }
}
