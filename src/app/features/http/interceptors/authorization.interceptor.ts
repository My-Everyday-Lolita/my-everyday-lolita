import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSignInService } from '../../user/user-sign-in.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

  constructor(private userSignInService: UserSignInService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.headers.has('authorization') && request.headers.get('authorization') === 'auto') {
      request = request.clone({ headers: request.headers.set('authorization', `Bearer ${this.userSignInService.getAccessToken()}`) });
    }
    return next.handle(request);
  }
}
