import { Component, OnInit } from '@angular/core';
import { StationsService } from '../stations.service';
import { Observable } from 'rxjs/observable';
import { Station } from '../../shared/station';
import { AuthService } from '../../core/auth.service';
import { User } from '../../core/core.module';
import { BehaviorSubject } from 'rxjs';
import { PlayerService } from '../../shared/player.service';
import { UserService } from '../../core/user.service';
import { MatDialog } from '@angular/material';
import { StationComponent } from '../station/station.component';
import { EventsService } from '../../core/events.service';
import { ShareStationService } from '../share-station.service';
import { ShareStationComponent } from '../share-station/share-station.component';
import { ManageSharesComponent } from '../manage-shares/manage-shares.component';
import { ShareStation } from '../../shared/station-share';
import * as _ from 'underscore';

@Component({
  selector: 'app-stations-page',
  templateUrl: './stations-page.component.html',
  styleUrls: ['./stations-page.component.css']
})
export class StationsPageComponent implements OnInit {
  myStations: Array<Station> = new Array<Station>();

  constructor(private stationSrvc: StationsService,
    public userService: UserService,
    private playerSrvc: PlayerService,
    private dialog: MatDialog,
    private evtSrvc: EventsService,
    private shrStnSrvc: ShareStationService) {
  }

  ngOnInit() {
    this.evtSrvc.subscribe('CREATE_STATION').subscribe(value => {
      this.modifyStation(new Station());
    });
    this.evtSrvc.subscribe('SHARE_STATION').subscribe(value => {
      this.shareAll();
    });
    this.evtSrvc.subscribe('MANAGE_SHARE').subscribe(value => {
      this.dialog.open(ManageSharesComponent);
    });
    this.stationSrvc.getStations().subscribe((value) => {
      console.log(value);
      if (value) {
        this.myStations.unshift(value);
        if (value.favourite) {
          this.playerSrvc.addToList(value);
        }
      }
    });
    this.stationSrvc.refreshStations();

    // const temp = this.myStations.subscribe(data => {
    //   // temp = data);
    //  console.log(data);

    // });
  }
  play(station: Station) {
    if (station.playing) {
      this.playerSrvc.stop();
    } else {
      this.playerSrvc.play(station);
    }
  }
  changeFav(station: Station) {
    station.favourite = !station.favourite;
    this.stationSrvc.updateUserStation(station).then(() => {
      if (station.favourite) {
        this.playerSrvc.addToList(station);
      } else {
        this.playerSrvc.removeFromList(station);
      }
    });
  }
  updateStation(station: Station) {
    this.stationSrvc.update(station);
  }
  modifyStation(station: Station) {
    this.dialog.open(StationComponent, {
      disableClose: true,
      data: station
    });
  }
  deleteStation(station: Station) {
    this.stationSrvc.delete(station.id);
  }
  shareStation(station: Station) {
    // this.shrStnSrvc.add(station);
    let shrStn: ShareStation = new ShareStation();
    _.extend(shrStn, station);
    this.dialog.open(ShareStationComponent, {
      disableClose: true,
      data: [shrStn]
    });
  }
  toggleAddtoShare(station: Station) {
    if (station.addedtoshare) {
      this.shrStnSrvc.remove(station);
    } else {
      this.shrStnSrvc.add(station);
    }
  }
  shareAll() {
    this.dialog.open(ShareStationComponent, {
      disableClose: true
    });
  }
}
