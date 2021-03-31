import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../items/items.model';

@Pipe({
  name: 'cacheItemPhoto'
})
export class CacheItemPhotoPipe implements PipeTransform {

  transform(obs: Observable<Item | undefined>): Observable<string> {
    return obs.pipe(
      map(
        item => {
          if (!item) {
            return '';
          }
          return item.variants[0].photos[0];
        })
    );
  }

}
