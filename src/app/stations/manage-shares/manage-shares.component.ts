import { Component, OnInit, HostListener } from '@angular/core';
import { Share } from '../../shared/station-share';
import { ShareStationService } from '../share-station.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../core/confirmation-dialog/confirmation-dialog.component';

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
  constructor(private shrStnSrvc: ShareStationService,
    private dialogRef: MatDialogRef<ManageSharesComponent>,
    private dialog: MatDialog) {

    }
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
    const confDialog = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data: {
        title: 'Are you sure?',
        // tslint:disable-next-line:max-line-length
        content: 'This will delete shareURL and all related data.<br> Users with this shared link would not be able to import these stations.'
      }
    });
    confDialog.afterClosed().subscribe(value => {
      if (value) {
        this.shrStnSrvc.deleteShare(id).then(() => {
          this.shrStnSrvc.getShares().then(shares => {
            this.shares = shares;
          });
        });
      }
    });
  }
  copyToClip(inputBox) {
    inputBox.select();
    document.execCommand('copy');
    inputBox.setSelectionRange(0, 0);
  }
}
