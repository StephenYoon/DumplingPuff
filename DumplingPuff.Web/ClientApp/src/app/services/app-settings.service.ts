import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppSettings } from '../models/app-settings.model';
import { ApiService } from './api.service';

const apiPath = 'api/AppSettings';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
    appSettings$: BehaviorSubject<AppSettings>;

    constructor(private apiService: ApiService) {      
      //this.appSettings$ = new BehaviorSubject<AppSettings>(JSON.parse(localStorage.getItem('appSettings')));
      this.appSettings$ = new BehaviorSubject<AppSettings>(null);
    }

    get appSettings(): Observable<AppSettings> {
        return this.apiService.get<AppSettings>(apiPath)
          .pipe(map(appSettings => {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              // localStorage.setItem('appSettings', JSON.stringify(appSettings));
              this.appSettings$.next(appSettings);
              return appSettings;
          }));
    }
}
