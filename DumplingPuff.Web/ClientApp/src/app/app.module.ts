import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, NG_VALIDATORS } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { WaruSkiesModule } from './modules/waru-skies/waru-skies.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { FetchDataComponent } from './components/fetch-data/fetch-data.component';

import { environment } from '@environments';

import { AuthGuard } from './authentication/auth.guard';
import { SignalRService } from './services/signal-r.service';
import { SignalRWaruSkiesService } from './services/signal-r-waru-skies.service';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
  VKLoginProvider,
  MicrosoftLoginProvider
} from 'angularx-social-login';

export function initAppChat(signalRService: SignalRService) {
  return () => {
    return signalRService.connect()
      .then(() => {
        console.log('InitApp for Chat completed successfully!');
      })
      .catch(err => {
        console.error('InitApp for Chat encountered an error: ' + err);
      });
  };
}

export function initAppWaruSkies(signalRWaruSkiesService: SignalRWaruSkiesService) {
  return () => {
    return signalRWaruSkiesService.connect()
    .then(() => {
      console.log('InitApp for WaruSkies completed successfully!');
    })
    .catch(err => {
      console.error('InitApp for WaruSkies encountered an error: ' + err);
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavMenuComponent,
    ChatBoxComponent,
    FetchDataComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    SocialLoginModule,
    WaruSkiesModule
  ],
  providers: [
    AuthGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: initAppChat,
      multi: true,
      deps: [SignalRService]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initAppWaruSkies,
      multi: true,
      deps: [SignalRWaruSkiesService]
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleAuthClientId),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('client-id'),
          },
          {
            id: AmazonLoginProvider.PROVIDER_ID,
            provider: new AmazonLoginProvider('client-id'),
          },
          {
            id: VKLoginProvider.PROVIDER_ID,
            provider: new VKLoginProvider('client-id'),
          },
          {
            id: MicrosoftLoginProvider.PROVIDER_ID,
            provider: new MicrosoftLoginProvider(environment.msAuthClientId, {
              redirect_uri: environment.baseApiUrl
            })
          },
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
