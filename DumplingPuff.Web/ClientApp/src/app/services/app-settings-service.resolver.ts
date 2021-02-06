import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { AppSettings } from '../models/app-settings.model';

@Injectable()
export class AppSettingsServiceResolver implements Resolve<AppSettings> {

  constructor(
    private appSettingsService: AppSettingsService
  ) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): AppSettings | Observable<AppSettings> | Promise<AppSettings> {
    return this.appSettingsService.appSettings;
  }
}
