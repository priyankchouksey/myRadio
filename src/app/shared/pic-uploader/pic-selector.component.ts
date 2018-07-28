import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pic-selector',
  templateUrl: './pic-selector.component.html',
  styleUrls: ['./pic-selector.component.css']
})
export class PicSelectorComponent implements OnInit {
  filename: string;
  isSmallScreen: boolean;
  imageUrlPreview = '';
  imageSelectPreview = 'assets/images/image-preview.png';
  currentIndex = 0;
  isFileOver: boolean;
  selectedFile: File;
  private imageurl: string;
  public get imageUrl(): string {
    return  this.imageurl;
  }

  public set imageUrl(v: string) {
    this.imageurl = v;
    this.imageUrlPreview = v;
  }


  @HostListener('window:resize', ['$event'])
    onResize(event?) {
      let width: string;
      if (window.innerWidth < 600 ) {
        width = '90%';
        this.isSmallScreen = true;
      } else {
        width = '60%';
        this.isSmallScreen = false;
      }
    this.dialogRef.updateSize(width, 'auto');
  }
  constructor(private dialogRef: MatDialogRef<PicSelectorComponent>, private snackBar: MatSnackBar) { }

  ngOnInit() {
    let width: string;
      if (window.innerWidth < 600 ) {
        width = '90%';
        this.isSmallScreen = true;
      } else {
        width = '60%';
        this.isSmallScreen = false;
      }
    this.dialogRef.updateSize(width, 'auto');
  }
  fileChange(files) {
    if (files.length > 0) {
      const file = files[0];
      if (file.type.split('/')[0] !== 'image') {
        this.snackBar.open('Doesn\'t seems an image', 'OK', {
          duration: 5000
        });
        // alert('I do not understand this file type. May be image file should work!');
      } else {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = (event) => {
          if (reader.result) {
            this.imageSelectPreview = reader.result;
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }
  fileOver(isOver) {
    this.isFileOver = isOver;
  }
  tabChanged(evt: MatTabChangeEvent) {
    this.currentIndex = evt.index;
  }
  imageUrlChange(evt) {
    this.imageUrlPreview = evt.target.value;
  }
  imageUrlError(evt) {
    if (evt) {
      this.imageUrlPreview = '';
    }
  }
  closeDialog() {
    const retValue = {
      'imageType': this.currentIndex === 0 ? 'URL' : 'FILE',
      'imageUrl': this.currentIndex === 0 ? this.imageUrlPreview : this.imageSelectPreview,
      'file': this.currentIndex === 0 ? null : this.selectedFile
    };
    this.dialogRef.close(retValue);
  }
}
