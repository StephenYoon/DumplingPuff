import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { AppSettings } from '../models/app-settings.model';
import { SignalRService } from './signal-r.service';

@Injectable()
export class SignalRServiceResolver implements Resolve<void> {

  constructor(
    private signalRService: SignalRService
  ) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void | Observable<void> | Promise<void> {
    return this.signalRService.connect();
  }
}
