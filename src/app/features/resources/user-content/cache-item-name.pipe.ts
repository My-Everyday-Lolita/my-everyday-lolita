import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../items/items.model';

@Pipe({
  name: 'cacheItemName'
})
export class CacheItemNamePipe implements PipeTransform {

  transform(obs: Observable<Item | undefined>): Observable<string> {
    return obs.pipe(
      map(
        item => {
          if (!item) {
            return '';
          }
          return `${item.brand.shortname || item.brand.name} ${item.collectionn || ''}`;
        })
    );
  }

}
