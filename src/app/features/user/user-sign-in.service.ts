import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserSignInDto, UserSignInInfos, UserSignInResponse } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserSignInService {

  private readonly STORAGE_KEY = 'mel-usii';
  private signInInfos?: UserSignInInfos;
  private url = `${environment.domains.login}/auth/realms/${environment.api.auth.realm}/protocol/openid-connect/token`;
  private signedIn: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {
    const localInfos = localStorage.getItem(this.STORAGE_KEY) || null;
    if (localInfos) {
      this.signInInfos = JSON.parse(localInfos);
    }
    this.signedIn = new BehaviorSubject<boolean>(this.isSignedIn());
  }

  get signedIn$(): Observable<boolean> {
    return this.signedIn.asObservable();
  }

  getAccessToken(): string | undefined {
    return this.signInInfos?.access_token;
  }

  isSignedIn(): boolean {
    return !this.isExpired();
  }

  isExpired(): boolean {
    if (this.signInInfos === undefined) {
      return true;
    }
    const now = Date.now() / 100;
    return (now - this.signInInfos.datetime) > this.signInInfos.refresh_expires_in;
  }

  signIn(data: UserSignInDto): Observable<boolean> {
    const body = new URLSearchParams();
    body.set('username', data.username);
    body.set('password', data.password);
    body.set('grant_type', environment.api.auth.grant_type);
    body.set('client_id', environment.api.auth.client_id);
    body.set('scope', environment.api.auth.scope);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<UserSignInResponse>(this.url, body.toString(), options).pipe(
      catchError(err => {
        console.error(err);
        if (err.error && err.error.error === 'invalid_grant') {
          this.toastr.error('SIGN_IN.TOASTS.CREDENTIALS_ERROR', undefined, { closeButton: true, disableTimeOut: true, enableHtml: true });
        } else {
          this.toastr.error('SIGN_IN.TOASTS.UNKNOWN', undefined, { closeButton: true, disableTimeOut: true, enableHtml: true });
        }
        return of(false);
      }),
      map(response => {
        if (response !== false) {
          this.updateSignInInfos(response as UserSignInResponse);
        }
        return !!response;
      }),
      tap(response => this.signedIn.next(response))
    );
  }

  signOut(): void {
    this.signInInfos = undefined;
    localStorage.removeItem(this.STORAGE_KEY);
    this.signedIn.next(false);
    if (this.router.routerState.snapshot.url !== '/') {
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
  }

  refreshToken(): Observable<boolean> {
    if (this.signInInfos && this.signInInfos.refresh_token) {
      const body = new URLSearchParams();
      body.set('client_id', environment.api.auth.client_id);
      body.set('grant_type', 'refresh_token');
      body.set('refresh_token', this.signInInfos?.refresh_token);
      const options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      };
      return this.http.post(this.url, body.toString(), options).pipe(
        catchError(response => {
          if (response.error.error === 'invalid_grant') {
            this.signOut();
            this.toastr.error('SIGN_IN.TOASTS.EXPIRED_SESSION', undefined, { closeButton: true, disableTimeOut: true, enableHtml: true });
          } else {
            this.toastr.error('SIGN_IN.TOASTS.UNKNOWN', undefined, { closeButton: true, disableTimeOut: true, enableHtml: true });
            console.error(response);
          }
          return of(false);
        }),
        map(response => {
          if (response) {
            this.updateSignInInfos(response as UserSignInResponse);
          }
          return !!response;
        })
      );
    }
    return of(false);
  }

  private updateSignInInfos(response: UserSignInResponse): void {
    this.signInInfos = {
      ...response as UserSignInResponse,
      datetime: Date.now() / 100,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.signInInfos));
  }
}
