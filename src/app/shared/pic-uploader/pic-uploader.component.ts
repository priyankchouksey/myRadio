import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { AuthService } from '../../core/auth.service';
import { User } from '../../core/core.module';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Promise } from 'q';


@Component({
  selector: 'app-pic-uploader',
  templateUrl: './pic-uploader.component.html',
  styleUrls: ['./pic-uploader.component.scss']
})
export class PicUploaderComponent implements OnInit {
  private file: any;
  private user: User;
  private imgSrc: string;
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
  constructor(private auth: AuthService, private storage: AngularFireStorage) {

   }

  ngOnInit() {
  }
  imageChange(event) {
    this.file = event.target.files[0];
    if (this.file.type.split('/')[0] !== 'image') {
      alert('I do not understand this file type. May be image file should work!');
    } else {    const reader = new FileReader();
      reader.onload = (event) => {
        if (reader.result) {
          this.imageSource = reader.result;
        }
      };
      reader.readAsDataURL(this.file);
    }
    // if (file.type.split('/')[0] !== 'image') {
    //   alert('I do not understand this file type. May be image file should work!');
    // } else {
    //   const id = this.auth.userInfo.id;
    //   const path = id + '/' + this.newGuid();
    //   const fileRef = this.storage.ref(path);
    //   const task = this.storage.upload(path, file);
    //   this.uploadPercent = task.percentageChanges();
    //   task.snapshotChanges().pipe(
    //     finalize(() => {
    //       this.downloadURL = fileRef.getDownloadURL();
    //       this.downloadURL.subscribe(image => {
    //         this.imageSource = image;
    //         });
    //     })
    //   )
    //   .subscribe();
    // }
  }
  saveImage(filename: string) {
    return Promise((res, rej) => {
      try {
        const id = this.auth.userInfo.id;
        const path = id + '/' + filename + '.logo';
        const fileRef = this.storage.ref(path);
        const task = this.storage.upload(path, this.file);
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
      } catch (error) {
        rej('Error Uploading file...');
      }
    });
  }
  newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            // tslint:disable-next-line:no-bitwise
            const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
}
