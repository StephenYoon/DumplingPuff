import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SocialUser } from 'angularx-social-login';
import { SignalRService } from '../services/signal-r.service';
import { AppSettingsService } from '../services/app-settings.service';
import { ChatService } from '../services/chat.service';
import { CustomAuthService } from '../services/custom-auth.service';
import { AppSettings } from '../models/app-settings.model';
import { ChatMessage } from '../models/chat-message.model';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
  appSettings: AppSettings | undefined;
  chatHistory: ChatMessage[] = [];
  chatMessage: string;
  user: SocialUser;

  @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any>;
  @ViewChild('chatInputBox', { read: ElementRef }) public chatInputBox: ElementRef<any>;
  
  constructor(
    private router: Router,
    private appSettingsService: AppSettingsService,
    public signalRService: SignalRService, 
    private authService: CustomAuthService,
    private chatService: ChatService) { }

  ngOnInit() {
    this.appSettingsService.appSettings.subscribe(appSettings => {
      this.appSettings = appSettings;
    })

    this.authService.getCurrentUser().subscribe((data) => {
      this.user = data;
    });
    
    if (!this.user) {
      alert("Please log in first, thanks!.");
      this.router.navigate(['home']);
    }

    this.chatMessage = '';
    this.chatInputBox.nativeElement.focus();
  }

  public chatClick() {    
    if (this.chatMessage == ''){
      return;
    }

    var apiChatMessage = new ChatMessage();
    apiChatMessage.user = this.user;
    apiChatMessage.message = this.chatMessage;
    
    this.chatService.postChatMessage(apiChatMessage);

    this.chatMessage = '';
    this.scrollBottom();
    this.chatInputBox.nativeElement.focus();

    this.chatService.get().subscribe(res => {
      console.log(res);
    });
  }

  public scrollBottom() {
    console.log(this.scroll.nativeElement.scrollTop);
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }
}
