import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Coordination, CoordinationFieldType } from './user-content.model';
import { UserContentService } from './user-content.service';

@Injectable({
  providedIn: 'root'
})
export class CoordinationResolver implements Resolve<Coordination> {

  constructor(
    private userContentService: UserContentService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Coordination | Observable<Coordination> {
    if (route.params.id === 'new') {
      return {
        id: this.generateUuid(),
        title: '',
        event: '',
        place: '',
        theme: '',
        date: new Date(),
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
    return this.userContentService.content$.pipe(
      map(content => {
        return content.coordinations.find(coord => coord.id = route.params.id) as Coordination;
      })
    );
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
