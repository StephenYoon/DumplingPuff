import { Injectable, OnDestroy } from '@angular/core';
import { Observable , BehaviorSubject } from 'rxjs';
//import { LocalStorage } from '@ngx-pwa/local-storage';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, groupBy } from 'rxjs/operators';

import { UserService } from './user.service';
import { User } from '../models/user.model';

@Injectable()
export class CustomAuthService implements OnDestroy {
/*
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    // Setting logged in user in localstorage else null
    this.authService.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Sign in with Google
  GoogleAuth() {
    return this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  // Sign out
  SignOut() {
    return this.authService.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    });
  }
*/
  ngOnDestroy() {
  }
}