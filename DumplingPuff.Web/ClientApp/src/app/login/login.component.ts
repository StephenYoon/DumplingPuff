import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { SocialAuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
  VKLoginProvider,
  MicrosoftLoginProvider
} from 'angularx-social-login';
import { AppSettings } from '../models/app-settings.model';

import { AppSettingsService } from '../services/app-settings.service';
import { CustomAuthService } from '../services/custom-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  appSettings: AppSettings | undefined;
  user: SocialUser | undefined;
  user$: Observable<SocialUser>;
  GoogleLoginProvider = GoogleLoginProvider;

  constructor(
    private authService: CustomAuthService,
    private appSettingsService: AppSettingsService
  ) { }

  ngOnInit() {
    this.user$ = this.authService.getCurrentUser();

    this.appSettingsService.appSettings.subscribe(appSettings => {
      this.appSettings = appSettings;
    })
  }

  signInWithGoogle(): void {
    this.authService.signInWithGoogle();
  }

  signOut(): void {
    this.authService.signOut();
  }

  refreshGoogleToken(): void {
    this.authService.refreshGoogleToken();
  }
}
