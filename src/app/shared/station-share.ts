import { Station } from './station';

export class Share {
  id: string;
  name: string;
  shareUrl: string;
  stations: Array<ShareStation>;
  constructor() {
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
