import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Feature } from './features.model';
import { ResourcesColorsService } from './features.service';

@Injectable({ providedIn: 'root' })
export class ResourcesFeaturesResolver implements Resolve<Feature[]> {

  constructor(private featuresService: ResourcesColorsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Feature[] | Observable<Feature[]> | Promise<Feature[]> {
    return this.featuresService.findAll();
  }

}
