export class Station {
  id?: string;
  active: boolean;
  createdate: Date;
  createdby: string;
  frequency: string;
  logo: string;
  name: string;
  playurl: string;
  website: string;
  assistKeyword: string;
  favourite: boolean;
  playing: boolean;
  geo = new GeoLocation();
  userstatioid: string;
  constructor (rawData?: any) {
    if (rawData) {
      this.id = rawData.id;
      this.userstatioid = rawData.usID;
      this.active = true;
      this.geo.city = rawData.city;
      this.geo.country = rawData.country;
      this.geo.state = rawData.state;
      this.createdby = rawData.createdby;
      this.frequency = rawData.frequency;
      this.logo = rawData.logo;
      this.name = rawData.name;
      this.playurl = rawData.playurl;
      this.playing = rawData.isplaying;
      this.favourite = rawData.favourite;
    }
  }
}
export class UserStation {
  id?: string;
  userID: string;
  stationID: string;
  playing: boolean;
  favourite: boolean;
}
export class GeoLocation {
  city: string;
  country: string;
  state: string;
}
