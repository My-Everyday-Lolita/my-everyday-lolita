import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserSignInService } from '../../user/user-sign-in.service';

@Injectable()
export class InactiveInterceptor implements HttpInterceptor {

  constructor(private userSignInService: UserSignInService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError((response: HttpErrorResponse) => {
      if (response.error.statusCode === 401 && response.error.inactive) {
        return this.userSignInService.refreshToken().pipe(
          switchMap(signedIn => {
            if (signedIn) {
              const req = request.clone({
                headers: request.headers.set('authorization', `Bearer ${this.userSignInService.getAccessToken()}`)
              });
              return next.handle(req);
            }
            response.error.inactive = false;
            return throwError(response);
          })
        );
      }
      return throwError(response);
    }));
  }
}
