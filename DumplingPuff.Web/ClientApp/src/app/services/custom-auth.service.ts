import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable , BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, groupBy } from 'rxjs/operators';

import { SocialAuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
  VKLoginProvider,
  MicrosoftLoginProvider
} from 'angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class CustomAuthService implements OnDestroy {
  currentUser: SocialUser;
  currentUser$: BehaviorSubject<SocialUser>;

  constructor(
    public authService: SocialAuthService,
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    this.currentUser$ = new BehaviorSubject<SocialUser>(null);

    // Setting logged in user in localstorage else null
    this.authService.authState.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.currentUser$.next(user);
        localStorage.setItem('user', JSON.stringify(this.currentUser));
      } else {
        localStorage.setItem('user', null);
        this.currentUser$.next(null);
      }
    });
  }
  
  getUser(): SocialUser {
    var retrievedUser = JSON.parse(localStorage.getItem('user')) as SocialUser;
    return retrievedUser;
  }

  getCurrentUser(): BehaviorSubject<SocialUser> {
    var retrievedUser = JSON.parse(localStorage.getItem('user')) as SocialUser;
    this.currentUser$.next(retrievedUser);

    return this.currentUser$;
  }

  isLoggedIn() {
    var retrievedUser = this.getUser();
    return !!retrievedUser;
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signInWithAmazon(): void {
    this.authService.signIn(AmazonLoginProvider.PROVIDER_ID);
  }

  signInWithVK(): void {
    this.authService.signIn(VKLoginProvider.PROVIDER_ID);
  }

  signInWithMicrosoft(): void {
    this.authService.signIn(MicrosoftLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut().then(() => {
      localStorage.removeItem('user');
      this.currentUser$.next(null);
      this.router.navigate(['/']);
    });
  }

  refreshGoogleToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  ngOnDestroy() {
    //localStorage.removeItem('user');
  }
}