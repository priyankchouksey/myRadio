import { Component, OnInit, Inject, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from '../../core/user.service';
import { StationsService } from '../stations.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectionList } from '../../../../node_modules/@angular/material';
import { ShareStationService } from '../share-station.service';
import { Share, ShareStation } from '../../shared/station-share';
import { Station } from '../../shared/station';
@Component({
  selector: 'app-share-station',
  templateUrl: './share-station.component.html',
  styleUrls: ['./share-station.component.css']
})
export class ShareStationComponent implements OnInit, AfterViewInit {
  // generatedURL: string;
  shareData: Share;
  shareSaved: boolean;
  showSelection: boolean;
  @ViewChild('selectList') selectList: MatSelectionList;
  @HostListener('window:resize', ['$event'])
    onResize(event?) {
      let width: string;
      if (window.innerWidth < 600 ) {
        width = '90%';
      } else {
        width = '80%';
      }
    this.dialogRef.updateSize(width);
  }
  constructor(private usrSrvc: UserService,
    private stnSrvc: StationsService,
    private dialogRef: MatDialogRef<ShareStationComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Array<ShareStation>,
    private shrStnSrvc: ShareStationService) {
      this.shareData = new Share();
     }

  ngOnInit() {
    let width: string;
    if (window.innerWidth < 600 ) {
      width = '90%';
    } else {
      width = '60%';
    }
    this.dialogRef.updateSize(width);

    if (this.data) {
      // Sharing a single station
      this.shareData.stations = this.data;
      this.shareData.name = this.data[0].name;
      this.showSelection = false;
    } else {
      // sharing a list
      this.shareData.stations = <Array<ShareStation>> this.shrStnSrvc.getShareStationList();
      this.showSelection = true;
    }
    // this.generatedURL = 'http://dummy.url/share/32nsdekrbwek324';
  }
  ngAfterViewInit() {
    // this.selectList.selectAll();
  }
  closeDialog(isClosedCliecked: boolean) {
    this.dialogRef.close(isClosedCliecked);
  }
  save() {
    this.shrStnSrvc.saveShare(this.shareData).then(() => {
      this.shareData.shareUrl = location.origin + '/shared/' + this.shareData.id;
      this.shareSaved = true;
    });
    // this.shareData.shareUrl = 'dummy.com';
  }
  openEmail() {
    const sub = `${this.usrSrvc.currentUser.name} Shared ${this.shareData.name} with you.`;
    const body = `Hi There, %0D%0A %0D%0A \
Checkout the new Radio stations I am listening to and I feel you would like them too.%0D%0A %0D%0A \
Click below link (or copy it and paste in browser window) to import the stations in your user space.%0D%0A %0D%0A \
${this.shareData.shareUrl} %0D%0A %0D%0A \
Regards, %0D%0A %0D%0A \
${this.usrSrvc.currentUser.name}`;
    window.open('mailto:?subject=' + sub + '&body=' + body, '_self');
  }
  copytoClipboard(inputBox) {
    inputBox.select();
    document.execCommand('copy');
    inputBox.setSelectionRange(0, 0);
  }
  noneSelected() {
    return this.shareData.stations.findIndex(value => {
      return value.selected;
    }) === -1;
  }
}
