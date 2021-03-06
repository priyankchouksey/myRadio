import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/user.service';
import { Share } from '../../shared/station-share';
import { ShareStationService } from '../share-station.service';
import { EventsService } from '../../core/events.service';

@Component({
  selector: 'app-import-share',
  templateUrl: './import-share.component.html',
  styleUrls: ['./import-share.component.css']
})
export class ImportShareComponent implements OnInit {
  shareID: string;
  shareData: Share = new Share();
  constructor(private route: ActivatedRoute, private router: Router,
    public usrSrvc: UserService,
    private shrStnSrvc: ShareStationService,
    private zone: NgZone, private evtSrvc: EventsService) { }

  ngOnInit() {
    this.shareID = this.route.snapshot.paramMap.get('id');
    if (this.usrSrvc.currentUser && this.usrSrvc.currentUser.loggedIn) {
      this.loadShare();
    } else {
      this.usrSrvc.loginStatusChange.subscribe(loggedIn => {
        this.loadShare();
      });
    }
  }
  private loadShare(): any {
    this.shrStnSrvc.getShare(this.shareID).then(data => {
      this.zone.run(() => {
        this.shareData = data;
      });
    });
  }
  noneSelected() {
    return this.shareData.stations.findIndex(value => {
      return value.selected;
    }) === -1;
  }
  import() {
    this.shrStnSrvc.importShare(this.shareData).then(() => {
      this.router.navigate(['myStations']);
    })
    .catch();
  }
  cancel() {
    this.router.navigate(['myStations']);
  }
  loginClicked() {
    this.evtSrvc.publish('LOGIN_CLICKED');
  }
}
