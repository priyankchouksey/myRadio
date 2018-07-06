import { Pipe, PipeTransform } from '@angular/core';
import { Station } from '../shared/station';

@Pipe({
  name: 'favStations',
  pure: false
})
export class FavStationsPipe implements PipeTransform {

  transform(value: Array<Station>): Array<Station> {
    return value.filter(station => station.favourite);
  }

}
