import { Station } from './station';
import { Time } from '@angular/common';

export class Share {
  id: string;
  name: string;
  shareUrl: string;
  stations: Array<ShareStation>;
  createDate: Time;
  importCount: number;
  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.createDate = data.createdate;
      this.importCount = data.importcount;
      this.shareUrl = location.origin + '/shared/' + data.id;
    }
    this.stations = new Array<ShareStation>();
  }
}
export class ShareDoc {
  name: string;
  userid: string;
}
export class ShareStation extends Station {
  selected: boolean;
  alreadyexists: boolean;
  constructor(rawData?: any) {
    super(rawData);
    this.selected = true;
  }
}
