import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { Station } from '../../shared/station';
import { StationsService } from '../stations.service';
import { AuthService } from '../../core/auth.service';
import { User } from '../../core/core.module';
import { PicUploaderComponent } from '../../shared/pic-uploader/pic-uploader.component';
import { UserService } from '../../core/user.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-station-page',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})
export class StationComponent implements OnInit {
  station: Station = new Station();
  // user: User;
  @HostListener('window:resize', ['$event'])
    onResize(event?) {
      let width: string;
      if (window.innerWidth < 600 ) {
        width = '90%';
      } else {
        width = '60%';
      }
    this.dialogRef.updateSize(width);
  }
  constructor(private stationSrvc: StationsService, private usrSrvc: UserService,
    private dialogRef: MatDialogRef<StationComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any, private snackBar: MatSnackBar) {
    // this.auth.getCurrentUser().then(user => {
    //   this.user = user;
    // });
  }

  ngOnInit() {
    this.station = this.data;
    // this.station.id = 'sdf';
  }
  save(picUploader: PicUploaderComponent) {
    if (this.station.id) {
      // Update the record
      this.stationSrvc.update(this.station).then(() => {
        this.dialogRef.close();
      })
      .catch(err => {
        this.snackBar.open('Error while saving data.', 'Send to Developer', {duration: 2000});
      });
    } else {
      // Create New record
      picUploader.saveImage(this.stationSrvc.getNewID()).then(value => {
        this.station.logo = String(value);
        this.station.createdate = new Date(Date.now());
        this.station.createdby = this.usrSrvc.currentUser.id;
        this.stationSrvc.create(this.station).then(() => {
          this.dialogRef.close();
        })
        .catch(err => {
          this.snackBar.open('Error while saving data.', 'Send to Developer', {duration: 2000});
        });
      });
    }
  }
  cancel() {
    this.dialogRef.close();
  }
}
