import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { Coordination, CoordinationFieldType } from './user-content.model';
import { UserContentService } from './user-content.service';

@Injectable({
  providedIn: 'root'
})
export class CoordinationResolver implements Resolve<Coordination | UrlTree> {

  constructor(
    private userContentService: UserContentService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Coordination | Observable<Coordination> | UrlTree {
    if (route.params.id === 'new') {
      return {
        id: this.generateUuid(),
        title: '',
        event: '',
        place: '',
        theme: '',
        date: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        fields: [
          { type: CoordinationFieldType.HEADDRESS, value: null },
          { type: CoordinationFieldType.HAIRSTYLE, value: null },
          { type: CoordinationFieldType.MAIN_PIECE, value: null },
          { type: CoordinationFieldType.TOPWEAR, value: null },
          { type: CoordinationFieldType.OUTERWEAR, value: null },
          { type: CoordinationFieldType.BAG, value: null },
          { type: CoordinationFieldType.ACCESSORIES, value: [] },
          { type: CoordinationFieldType.LEGWEAR, value: [] },
          { type: CoordinationFieldType.SHOES, value: null },
          { type: CoordinationFieldType.UNDERWEAR, value: [] },
          { type: CoordinationFieldType.OTHERS, value: [] },
        ],
        memo: ''
      };
    }
    if (this.userContentService.content) {
      return this.userContentService.content.coordinations.find(coord => coord.id === route.params.id) as Coordination;
    }
    return this.router.createUrlTree(['/', 'my-coord-checklist']);
  }

  generateUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
      // tslint:enable
    });
  }
}
