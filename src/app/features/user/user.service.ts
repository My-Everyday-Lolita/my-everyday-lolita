import { Injectable } from '@angular/core';
import { UserSignInService } from './user-sign-in.service';
import jwt_decode from 'jwt-decode';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user?: User;

  constructor(
    private userSignInService: UserSignInService
  ) { }

  getUserInfos(): User | null {
    if (this.userSignInService.isSignedIn()) {
      if (!this.user) {
        this.user = jwt_decode(this.userSignInService.getAccessToken() as string) as User;
      }
      return this.user;
    }
    return null;
  }

  isAdmin(): boolean {
    return (this.user && this.user.realm_access.roles.includes('admin')) as boolean;
  }

  hasRole(role: string): boolean {
    return this.isAdmin() || (this.user && this.user.realm_access.roles.includes(role)) as boolean;
  }
}
