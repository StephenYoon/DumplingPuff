import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SocialUser } from 'angularx-social-login';
import { SignalRService } from '../services/signal-r.service';
import { CustomAuthService } from '../services/custom-auth.service';
import { AppSettingsService } from '../services/app-settings.service';
import { AppSettings } from '../models/app-settings.model';
import { ChatMessage } from '../models/chat-message.model';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
  appSettings: AppSettings | undefined;
  chatMessage: string;
  user: SocialUser;

  @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any>;
  @ViewChild('chatInputBox', { read: ElementRef }) public chatInputBox: ElementRef<any>;
  
  constructor(
    public signalRService: SignalRService, 
    private router: Router,
    private authService: CustomAuthService,
    private appSettingsService: AppSettingsService,
    private http: HttpClient) { }

  ngOnInit() {
    this.appSettingsService.appSettings.subscribe(appSettings => {
      this.appSettings = appSettings;
    })

    this.authService.getCurrentUser().subscribe((data) => {
      this.user = data;      

      if (!this.user) {
        /*
        this.user = new SocialUser;
        this.user.email = "guest@gmail.com";
        this.user.name = "Guest";
        this.user.firstName = "Guest";
        this.user.lastName = "";
        this.user.photoUrl = "https://static.wikia.nocookie.net/food-fantasy/images/9/98/FA-Green_Dumpling.png/revision/latest/top-crop/width/360/height/450?cb=20181130145704";
        */
      }
    });
    
    if (!this.user) {
      alert("Please log in first.");
      this.router.navigate(['home']);
    }

    this.chatMessage = '';
    this.chatInputBox.nativeElement.focus();
  }

  public chatClick() {
    
    if (this.chatMessage == ''){
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    }); 
    var options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    var apiChatMessage = new ChatMessage();
    apiChatMessage.user = this.user;
    apiChatMessage.message = this.chatMessage;
    this.http.post<string>(this.appSettings.baseApiUrl + '/api/chat', apiChatMessage,  {headers: headers})
      .subscribe(res => {
        console.log(res);
      })

    this.chatMessage = '';
    this.scrollBottom();
    this.chatInputBox.nativeElement.focus();
  }

  public scrollBottom() {
    console.log(this.scroll.nativeElement.scrollTop);
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }
}
