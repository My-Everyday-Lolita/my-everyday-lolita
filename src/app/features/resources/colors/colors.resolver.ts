import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Color } from './colors.model';
import { ResourcesColorsService } from './colors.service';

@Injectable({ providedIn: 'root' })
export class ResourcesColorsResolver implements Resolve<Color[]> {

  constructor(private colorsService: ResourcesColorsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Color[] | Observable<Color[]> | Promise<Color[]> {
    return this.colorsService.findAll();
  }

}
