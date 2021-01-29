import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from './services/app-settings.service';
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
    public signalRService: SignalRService, 
    private appSettingsService: AppSettingsService,
    private http: HttpClient) { }

  ngOnInit() {
    this.appSettingsService.appSettings.subscribe(appSettings => {
      this.appSettings = appSettings;
      
      this.signalRService.startConnection(this.appSettings.baseApiUrl);
      this.signalRService.chatMessageListener();
      this.signalRService.chatHistoryListener();
      this.startHttpRequest();
    })
  }
    
  private startHttpRequest = () => {
    this.http.get(this.appSettings.baseApiUrl + '/api/chat')
      .subscribe(res => {
        console.log('Started listening: ' + res);
      })
  }
}
