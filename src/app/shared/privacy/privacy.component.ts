import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
    onResize(event?) {
      let height = '90%';
      if (window.innerWidth < 600 ) {
        height = '85%';
      }
    this.dialogRef.updateSize('98%', height);
  }
  constructor(private dialogRef: MatDialogRef<PrivacyComponent>) { }

  ngOnInit() {
  }

}
