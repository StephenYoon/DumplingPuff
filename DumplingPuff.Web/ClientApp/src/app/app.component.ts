import { Component, OnInit } from '@angular/core';
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
  ) { }

  ngOnInit() {
  }
}
