import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserContentService } from './user-content.service';

@Injectable({
  providedIn: 'root'
})
export class CoordinationGuard implements CanActivate {

  constructor(
    private userContentService: UserContentService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userContentService.content$.pipe(map(content => {
      if (route.params.id === 'new') {
        return true;
      }
      if (!content.coordinations.find(coord => coord.id === route.params.id)) {
        this.toastr.error('COORDINATION.ERRORS.NOT_FOUND', undefined, { disableTimeOut: true, closeButton: true });
        return this.router.createUrlTree(['/', 'my-coord-checklist']);
      }
      return true;
    }));
  }

}
