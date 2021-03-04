import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { UserSignInService } from './user-sign-in.service';

@Injectable({
  providedIn: 'root'
})
export class SignedInGuard implements CanActivate {

  constructor(
    private signInService: UserSignInService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isSignedIn = this.signInService.isSignedIn();
    if (!isSignedIn) {
      this.translate.get('APP.TOASTS.ERRORS.SIGNED_IN').subscribe(translatedString => {
        this.toastr.error(translatedString, undefined);
      });
    }
    return isSignedIn;
  }
}
