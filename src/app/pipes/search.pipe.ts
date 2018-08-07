import { Pipe, PipeTransform } from '@angular/core';
import { Station } from '../shared/station';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(collection: Array<Station>, args?: string): any {
    if (!collection) {
      return null;
    } else if (!args || args === '') {
      return collection;
    }
    return collection.filter(item => {
      const city = item.geo.city ? item.geo.city : '';
      const state = item.geo.state ? item.geo.state : '';
      const country = item.geo.country ? item.geo.country : '';

      if (item.name.toLowerCase() === args.toLowerCase() ||
        item.frequency === args ||
        city.toLowerCase() === args.toLowerCase() ||
        state.toLowerCase() === args.toLowerCase() ||
        country.toLowerCase() === args.toLowerCase()
      ) {
        return true;
      } else {
        return false;
      }
    });
  }
}
