import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UserContentService } from './user-content.service';

@Injectable({
  providedIn: 'root'
})
export class UserContentReadyGuard implements CanActivateChild {

  constructor(private userContentService: UserContentService) { }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.userContentService.ready$.pipe(filter(ready => ready));
  }

}
