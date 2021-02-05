import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http'; 
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppSettings } from '../models/app-settings.model';
import { ApiService } from './api.service';

const apiPath = 'api/AppSettings';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
    private _appSettings$: BehaviorSubject<AppSettings>;

    constructor(private apiService: ApiService) {      
      this._appSettings$ = new BehaviorSubject<AppSettings>(JSON.parse(localStorage.getItem('appSettings')));
    }

    get appSettings(): Observable<AppSettings> {
        var mockAppSettings = new AppSettings();
        mockAppSettings.authenticationGoogleClientId = "clientid";
        mockAppSettings.authenticationGoogleClientSecret = "clientsecret";

        return this.apiService.get<AppSettings>(apiPath)
          .pipe(map(appSettings => {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('appSettings', JSON.stringify(appSettings));
              this._appSettings$.next(appSettings);
              return appSettings;
          }));
    }
}
