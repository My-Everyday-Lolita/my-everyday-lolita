import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Brand } from './brands.model';
import { ResourcesBrandsService } from './brands.service';

@Injectable({ providedIn: 'root' })
export class ResourcesBrandsResolver implements Resolve<Brand[]> {

  constructor(private brandsService: ResourcesBrandsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Brand[] | Observable<Brand[]> | Promise<Brand[]> {
    return this.brandsService.findAll();
  }

}
