import { Pipe, PipeTransform } from '@angular/core';
import { Station } from '../shared/station';
import { stat } from 'fs';

@Pipe({
  name: 'groupby'
})
export class GroupbyPipe implements PipeTransform {
  transform(collection: Array<Station>, args?: string): any {
    if (!collection) {
      return null;
    }
    if (!args || args === '') {
      return collection;
    }
    const groupedCollection = collection.reduce((previous, current) => {
      const key = (args && args !== 'none') ? this.getKey(args, current) : 'none';
      if (!previous[key]) {
          previous[key] = [current];
      } else {
          previous[key].push(current);
      }
      return previous;
    }, {});

  return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
  }
  getKey(pref: string, station: Station): string {
    let retVal = '';
    switch (pref) {
      case 'city':
        retVal = station.geo.city ? this.toTitleCase(station.geo.city) : '';
        retVal += (retVal !== '' ? ' ' : '') + (station.geo.state ? station.geo.state.toUpperCase() : '');
        retVal += (retVal !== '' ? ', ' : '') + (station.geo.country ? station.geo.country.toUpperCase() : '');
        break;
      case 'state':
      retVal = station.geo.state ? station.geo.state.toUpperCase() : '';
      retVal += (retVal !== '' ? ', ' : '') + (station.geo.country ? station.geo.country.toUpperCase() : '');
        break;
      case 'country':
        retVal = station.geo.country ? station.geo.country.toUpperCase() : '';
        break;
      case 'language':
        retVal = station.getLanguage();
        break;
      case 'genre':
        retVal = station.getGenre();
        break;
      default:
        retVal = 'none';
        break;
    }
    retVal = retVal !== '' ? retVal : 'Others';
    return retVal;
  }
  toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}
}
