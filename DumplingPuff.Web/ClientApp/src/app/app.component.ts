import { Component, OnInit } from '@angular/core';
import { SignalRService } from './services/signal-r.service';
import { SocialUser } from 'angularx-social-login';
import { AppSettings } from './models/app-settings.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {  
  appSettings: AppSettings | undefined;
  chatMessage: string;
  user: SocialUser;
  
  constructor(
    public signalRService: SignalRService
  ) { }

  ngOnInit() {
    //this.signalRService.connect();
  }
}
