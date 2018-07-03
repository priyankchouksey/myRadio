export class Station {
  id?: string;
  active: boolean;
  city: string;
  country: string;
  createdate: Date;
  createdby: string;
  frequency: string;
  logo: string;
  name: string;
  playurl: string;
  state: string;
  website: string;
  assistKeyword: string;
  isfavourite: boolean;
  isplaying: boolean;
}
export class UserStation {
  id?: string;
  userID: string;
  stationID: string;
}
