import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Station } from '../../shared/station';
import { StationsService } from '../stations.service';
import { AuthService } from '../../core/auth.service';
import { User, Option } from '../../core/core.module';
import { PicUploaderComponent } from '../../shared/pic-uploader/pic-uploader.component';
import { UserService } from '../../core/user.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import {Genres, Languages} from '../../shared/station';

@Component({
  selector: 'app-station-page',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})
export class StationComponent implements OnInit {
  station: Station = new Station();
  // genres = Genres;
  // languages = Languages;
  lngCtrl = new FormControl();
  genCtrl = new  FormControl();
  filteredGenres: Observable<Option[]>;
  filteredLanguages: Observable<Option[]>;

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
    if (this.station.genre) {
      this.genCtrl.setValue(Genres.find(item => item.value === this.station.genre));
    }
    if (this.station.language) {
      this.lngCtrl.setValue(Languages.find(item => item.value === this.station.language));
    }
    this.filteredGenres = this.genCtrl.valueChanges.pipe(
      startWith<string | User>(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filterGens(name) : Genres.slice())
    );
    this.filteredLanguages = this.lngCtrl.valueChanges.pipe(
      startWith<string | User>(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filterLangs(name) : Languages.slice())
    );
  }
  save(picUploader: PicUploaderComponent) {
    this.station.language = this.lngCtrl.value.value;
    this.station.genre = this.genCtrl.value.value;
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
        this.station.logo = value;
        this.station.language = this.lngCtrl.value.value;
        this.station.genre = this.genCtrl.value.value;
        this.station.createdate = new Date(Date.now());
        this.station.createdby = this.usrSrvc.currentUser.id;
        this.stationSrvc.create(this.station).then(() => {
          this.cancel(true);
        })
        .catch(err => {
          this.snackBar.open('Error while saving data.', 'Send to Developer', {duration: 2000});
        });
      });
    }
  }
  cancel(success: boolean) {
    this.dialogRef.close(success);
  }
  display(user?: Option): string | undefined {
    return user ? user.title : undefined;
  }
  private _filterGens(name: string): Option[] {
    const filterValue = name.toLowerCase();

    return Genres.filter(option => option.title.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filterLangs(name: string): Option[] {
    const filterValue = name.toLowerCase();

    return Languages.filter(option => option.title.toLowerCase().indexOf(filterValue) === 0);
  }
}
