import { Injectable, OnDestroy } from '@angular/core';
import { Observable , BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, groupBy } from 'rxjs/operators';

import { UserService } from './user.service';
import { User } from '../models/user.model';

@Injectable()
export class AuthUserService implements OnDestroy {

  private user: User;
  private errorMessage: string;

  constructor(private userService: UserService) { }

  // store the session and call http get
  login(id: number) {
    return this.userService.getUser(id).pipe(
      map((user) => {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', 'JWT');
        return true;
      }),
      catchError((error) => {
        this.errorMessage = <any>error;
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