import { Component, OnInit, HostListener } from '@angular/core';
import { Share } from '../../shared/station-share';
import { ShareStationService } from '../share-station.service';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-manage-shares',
  templateUrl: './manage-shares.component.html',
  styleUrls: ['./manage-shares.component.css']
})
export class ManageSharesComponent implements OnInit {
  shares: any = new Array<Share>();
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    let width: string;
    if (window.innerWidth < 600 ) {
      width = '90%';
    } else {
      width = '60%';
    }
    this.dialogRef.updateSize(width, '80%');
  }
  constructor(private shrStnSrvc: ShareStationService, private dialogRef: MatDialogRef<ManageSharesComponent>) { }
  ngOnInit() {
    let width: string;
    if (window.innerWidth < 600 ) {
      width = '90%';
    } else {
      width = '60%';
    }
    this.dialogRef.updateSize(width, '80%');

    this.shrStnSrvc.getShares().then(value => {
      this.shares = value;
    })
    .catch(error => {

    });
  }
  delete(id: string) {

  }
  copyToClip() {
    
  }
}
