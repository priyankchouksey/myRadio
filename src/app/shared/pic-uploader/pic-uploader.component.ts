import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { AuthService } from '../../core/auth.service';
import { User } from '../../core/core.module';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Promise } from 'q';
import { UserService } from '../../core/user.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { PicSelectorComponent } from './pic-selector.component';


@Component({
  selector: 'app-pic-uploader',
  templateUrl: './pic-uploader.component.html',
  styleUrls: ['./pic-uploader.component.scss']
})
export class PicUploaderComponent implements OnInit {
  private file: any;
  private user: User;
  private imgSrc: string;
  private picdialog: MatDialogRef<PicSelectorComponent>;
  private dataToSave: any;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  @Output() imageSourceChange = new EventEmitter();
  @Input('imageSource')
  set imageSource (image: string) {
    if (image && image !== '') {
      this.imgSrc = image;
      document.getElementById('imagePreview').style['background-image'] = 'url(' + image + ')';
      this.imageSourceChange.emit(this.imgSrc);
    }
  }
  get imageSource() {
    return this.imgSrc;
  }
  constructor(private usrSrvc: UserService, private storage: AngularFireStorage, private dialog: MatDialog) {

   }

  ngOnInit() {
  }
  imageChange(event) {
    // this.file = event.target.files[0];
    // if (this.file.type.split('/')[0] !== 'image') {
    //   alert('I do not understand this file type. May be image file should work!');
    // } else {    const reader = new FileReader();
    //   reader.onload = (event) => {
    //     if (reader.result) {
    //       this.imageSource = reader.result;
    //     }
    //   };
    //   reader.readAsDataURL(this.file);
    // }
    this.picdialog = this.dialog.open(PicSelectorComponent);
    this.picdialog.afterClosed().subscribe(data => {
      if (data) {
        this.imageSource = data.imageUrl;
        this.dataToSave = data;
      }
    });
  }
  saveImage(filename: string) {
    return Promise((res, rej) => {
      if (this.dataToSave.imageType === 'FILE') {
        try {
        // this.usrSrvc.getCurrentUser().then(user => {
          const path = this.usrSrvc.currentUser.id + '/' + filename + '.logo';
          const fileRef = this.storage.ref(path);
          const task = this.storage.upload(path, this.dataToSave.file);
          this.uploadPercent = task.percentageChanges();
          task.snapshotChanges().pipe(
            finalize(() => {
              this.downloadURL = fileRef.getDownloadURL();
              this.downloadURL.subscribe(image => {
                res(image);
                // this.imageSource = image;
                });
            })
          )
          .subscribe();
        // });
      } catch (error) {
        rej('Error Uploading file...');
      }
    } else {
      res(this.imageSource);
    }
    });
  }
  // newGuid() {
  //       return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  //           // tslint:disable-next-line:no-bitwise
  //           const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
  //           return v.toString(16);
  //       });
  //   }
}
