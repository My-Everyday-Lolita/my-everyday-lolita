import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { Item } from './items.model';
import { ItemsService } from './items.service';

@Injectable({
  providedIn: 'root'
})
export class ResourcesItemResolver implements Resolve<Item> {

  constructor(private itemsService: ItemsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Item> {
    const id = route.params.id;
    if (id === 'new') {
      const tmp = sessionStorage.getItem(this.itemsService.TMP_SAVE_KEY);
      if (tmp) {
        return JSON.parse(tmp);
      }
      return null as any;
    }
    return this.itemsService.findById(id);
  }
}
