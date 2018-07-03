import { Component, OnInit } from '@angular/core';
import { StationsService } from '../stations.service';
import { Observable } from 'rxjs/observable';
import { Station } from '../../shared/station';
import { AuthService } from '../../core/auth.service';
import { User } from '../../core/core.module';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-stations-page',
  templateUrl: './stations-page.component.html',
  styleUrls: ['./stations-page.component.css']
})
export class StationsPageComponent implements OnInit {
  myStations: Array<Station> = new Array<Station>();
  userInfo: User;
  constructor(private stationSrvc: StationsService, private authSrvc: AuthService) {
    this.userInfo = authSrvc.userInfo;
  }

  ngOnInit() {
    this.stationSrvc.getStations().subscribe((value) => {
      console.log(value);
      if (value) {
        this.myStations.unshift(value);
      }
    });
    this.stationSrvc.refreshStations(this.userInfo.id);
    // const temp = this.myStations.subscribe(data => {
    //   // temp = data);
    //  console.log(data);

    // });
  }
  play(station) {

  }
}
