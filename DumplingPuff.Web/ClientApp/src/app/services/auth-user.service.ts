import { Injectable, OnDestroy } from '@angular/core';
import { Observable , BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, groupBy } from 'rxjs/operators';
import { SocialUser } from 'angularx-social-login';
import { CustomAuthService } from './custom-auth.service';

@Injectable()
export class AuthUserService implements OnDestroy {

  private user: SocialUser;

  constructor(private userService: CustomAuthService) { }

  // store the session and call http get
  login(id: number) {
    return this.userService.getCurrentUser().pipe(
      map((user) => {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', 'JWT');
        return true;
      }),
      catchError((error) => {
        return of(false);
      })
    );
  }

  isLoggedIn() {
   return !!localStorage.getItem('token');
  }

  ngOnDestroy() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}