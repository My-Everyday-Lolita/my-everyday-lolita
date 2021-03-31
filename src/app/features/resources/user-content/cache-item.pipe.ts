import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CacheService } from '../../cache/cache.service';
import { Item } from '../items/items.model';

@Pipe({
  name: 'cacheItem'
})
export class CacheItemPipe implements PipeTransform {

  constructor(private cacheService: CacheService) { }

  transform(id: string): Observable<Item> {
    return this.cacheService.match(id).pipe(
      switchMap(response => response ? response.json() : of(undefined))
    );
  }

}
