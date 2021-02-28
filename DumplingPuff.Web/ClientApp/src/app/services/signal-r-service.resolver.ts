import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { AppSettings } from '../models/app-settings.model';
import { SignalRService } from './signal-r.service';

@Injectable()
export class SignalRServiceResolver implements Resolve<boolean> {

  constructor(
    private signalRService: SignalRService
  ) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.signalRService.connect();
  }
}
