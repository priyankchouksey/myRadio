import { Component, OnInit, OnDestroy } from '@angular/core';
import { StationsService } from '../stations.service';
import { Station } from '../../shared/station';
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
import { ConfirmationDialogComponent } from '../../core/confirmation-dialog/confirmation-dialog.component';
import { SearchPipe } from '../../pipes/search.pipe';
import { GroupbyPipe } from '../../pipes/groupby.pipe';

@Component({
  selector: 'app-stations-page',
  templateUrl: './stations-page.component.html',
  styleUrls: ['./stations-page.component.css']
})
export class StationsPageComponent implements OnInit, OnDestroy {
  myStations: Array<Station> = new Array<Station>();
  showFilterLabel = false;
  searchText: string;
  groupByText: string;
  constructor(private stationSrvc: StationsService,
    public userService: UserService,
    private playerSrvc: PlayerService,
    private dialog: MatDialog,
    private evtSrvc: EventsService,
    private shrStnSrvc: ShareStationService) {
      this.groupByText = 'none';
  }

  ngOnInit() {
    this.evtSrvc.subscribe('CREATE_STATION').subscribe(value => {
      this.modifyStation(new Station());
    });
    this.evtSrvc.subscribe('SHARE_STATION').subscribe(value => {
      this.onShareAllClick();
    });
    this.evtSrvc.subscribe('MANAGE_SHARE').subscribe(value => {
      this.dialog.open(ManageSharesComponent);
    });
    this.evtSrvc.subscribe('SEARCH').subscribe(value => {
      this.doFilter(value);
    });
    this.refreshStations();
    this.userService.userPrefChange.subscribe(changes => {
      if (changes.indexOf('groupby') >= 0) {
        this.groupByText = this.userService.currentuser.userPreferences.groupby;
      }
    });
  }
  ngOnDestroy(): void {
    this.evtSrvc.unSubscribe('CREATE_STATION');
    this.evtSrvc.unSubscribe('SHARE_STATION');
    this.evtSrvc.unSubscribe('MANAGE_SHARE');
    this.evtSrvc.unSubscribe('SEARCH');
  }
  refreshStations() {
    this.groupByText = this.userService.currentUser.userPreferences.groupby ? this.userService.currentUser.userPreferences.groupby : 'none';
    this.stationSrvc.getStations().then(stations => {
      this.myStations = stations as Array<Station>;
      this.myStations.forEach(stn => {
        if (stn.favourite) {
          this.playerSrvc.addToList(stn);
        }
      });
      this.showFilterLabel = false;
    });
  }
  play(station: Station) {
    if (station.playing) {
      this.playerSrvc.stop();
    } else {
      this.playerSrvc.play(station);
    }
  }
  changeFav(station: Station) {
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
    const dlg = this.dialog.open(StationComponent, {
      disableClose: true,
      data: station
    });
    dlg.afterClosed().subscribe(data => {
      if (data) {
        this.refreshStations();
      }
    });
  }
  deleteStation(station: Station) {
    const dlg = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data: {title: 'Delete Station!',
        // tslint:disable-next-line:max-line-length
        content: 'Deleting this station will cause delete from all your (or other users\'s) shares as well as from other user\'s sapce. Instead you can just remove from your space.<br><br>Click Remove to remove from your space only.',
        buttons: [ {id: 1, title: 'Remove', color: null},
        { id: 2, title: 'Delete', color: null},
        { id: 3, title: 'Cancel', color: 'accent'}]
      }
    });

    dlg.afterClosed().subscribe(data => {
      switch (data.button) {
        case 1:
          this.stationSrvc.removeUserStation(station, false).then(() => {
            this.refreshStations();
          });
          break;
        case 2:
          this.stationSrvc.delete(station).then(() => {
            this.refreshStations();
          });
          break;
        default:
          break;
      }
    });
  }
  shareStation(station: Station) {
    // this.shrStnSrvc.add(station);
    // tslint:disable-next-line:prefer-const
    let shrStn: ShareStation = new ShareStation();
    _.extend(shrStn, station);
    this.dialog.open(ShareStationComponent, {
      disableClose: true,
      data: {'stations': [shrStn], 'name': station.name}
    });
  }
  toggleAddtoShare(station: Station) {
    if (station.addedtoshare) {
      this.shrStnSrvc.remove(station);
    } else {
      this.shrStnSrvc.add(station);
    }
  }
  onShareAllClick() {
     const dlg = this.dialog.open(ShareStationComponent, {
      disableClose: true
    });
    dlg.afterClosed().subscribe(isSaved => {
      if (isSaved) {
        this.myStations.forEach(element => {
          if (element.addedtoshare) {
            element.addedtoshare = false;
            this.shrStnSrvc.remove(element);
          }
        });
      }
    });
  }
  onFavClick(station: Station) {
    station.favourite = !station.favourite;
    this.changeFav(station);
  }
  doFilter(value: string) {
    if (value) {
      this.searchText = value;
      this.showFilterLabel = true;
    } else {
      this.searchText = null;
      this.showFilterLabel = false;
    }
  }
  clearSearch() {
    this.searchText = null;
    this.showFilterLabel = false;
  }
  onMenuClick(action: string, searchText: string, groupText: string, groupKey: string) {
    const sp = new SearchPipe();
    const spRes = sp.transform(this.myStations, searchText);
    const gp = new GroupbyPipe();
    const gpRes: any = gp.transform(spRes, groupText);
    const currentFilter = gpRes.find(value => value.key === groupKey);
    switch (action) {
      case 'share':
        this.shareFiltered(currentFilter.value, groupKey);
        break;
      case 'queue':
        currentFilter.value.forEach(element => {
          element.favourite = true;
          this.changeFav(element);
        });
        break;
    }
  }
  private shareFiltered(stations: Array<Station>, shareName) {
    let stnCounter = stations.length;
    const shrstnList: Array<ShareStation> = Array<ShareStation>();
    stations.forEach(element => {
      let shrStn: ShareStation = new ShareStation();
      _.extend(shrStn, element);
      shrstnList.push(shrStn);
      stnCounter--;
      if (stnCounter === 0) {
        this.dialog.open(ShareStationComponent, {
          disableClose: true,
          data: {'stations': shrstnList, 'name': shareName}
        });
      }
    });
  }
}
