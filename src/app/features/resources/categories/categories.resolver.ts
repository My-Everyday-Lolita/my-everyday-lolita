import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from './categories.model';
import { ResourcesCategoriesService } from './categories.service';

@Injectable({ providedIn: 'root' })
export class ResourcesCategoriesResolver implements Resolve<Category[]> {

  constructor(private categoriesService: ResourcesCategoriesService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Category[] | Observable<Category[]> | Promise<Category[]> {
    return this.categoriesService.findAll();
  }

}
