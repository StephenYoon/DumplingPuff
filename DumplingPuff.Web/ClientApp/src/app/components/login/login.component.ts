import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SocialUser } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
  VKLoginProvider,
  MicrosoftLoginProvider
} from 'angularx-social-login';

import { CustomAuthService } from '../../services/custom-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: SocialUser | undefined;
  user$: BehaviorSubject<SocialUser>;
  GoogleLoginProvider = GoogleLoginProvider;

  constructor(
    private authService: CustomAuthService
  ) { }

  ngOnInit() {
    this.user$ = this.authService.getCurrentUser();
  }

  signInWithGoogle(): void {
    this.authService.signInWithGoogle();
  }

  signInWithMicrosoft(): void {
    this.authService.signInWithMicrosoft();
  }

  signOut(): void {
    this.authService.signOut();
  }

  refreshGoogleToken(): void {
    this.authService.refreshGoogleToken();
  }
}
