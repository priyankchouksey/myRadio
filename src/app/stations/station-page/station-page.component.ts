import { Component, OnInit } from '@angular/core';
import { Station } from '../../shared/station';
import { StationsService } from '../stations.service';
import { AuthService } from '../../core/auth.service';
import { User } from '../../core/core.module';
import { PicUploaderComponent } from '../../shared/pic-uploader/pic-uploader.component';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'app-station-page',
  templateUrl: './station-page.component.html',
  styleUrls: ['./station-page.component.css']
})
export class StationPageComponent implements OnInit {
  station: Station = new Station();
  user: User;
  constructor(private stationSrvc: StationsService, private auth: UserService) {
    this.auth.getCurrentUser().then(user => {
      this.user = user;
    });
  }

  ngOnInit() {
    // this.station.id = 'sdf';
  }
  save(picUploader: PicUploaderComponent) {
    if (this.station.id) {
      // Update the record
    } else {
      // Create New record
      picUploader.saveImage(this.stationSrvc.getNewID()).then(value => {
        this.station.logo = String(value);
        this.station.createdate = new Date(Date.now());
        this.station.createdby = this.user.id;
        this.stationSrvc.create(this.station);
      });
    }
  }
  cancel() {

  }
}
