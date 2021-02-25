import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRegistrationDto } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserRegistrationService {

  constructor(
    private http: HttpClient
  ) { }

  register(data: UserRegistrationDto): Observable<any> {
    return this.http.post(`${environment.api.registration}/register`, data, { observe: 'response' });
  }

}
