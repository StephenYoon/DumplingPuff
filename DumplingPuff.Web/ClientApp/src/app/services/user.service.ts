import { Injectable, OnDestroy } from '@angular/core';
import { Observable , BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, groupBy } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable()
export class UserService implements OnDestroy {

  private user: User;
  private errorMessage: string;

  constructor(private userService: UserService) { }

  // store the session and call http get
  getUser(id: number) : Observable<User> {
    var user = new User();
    user.id = 1;
    user.firstname = "firstname";
    user.lastname = "lastname";
    user.email = "whoami@gmail.com";

    return new Observable((observer) => {
      observer.next(user)
      observer.complete()
    });
  }

  ngOnDestroy() {
  }
}