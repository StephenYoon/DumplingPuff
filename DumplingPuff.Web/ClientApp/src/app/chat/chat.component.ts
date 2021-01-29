import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SocialUser } from 'angularx-social-login';
import { SignalRService } from '../services/signal-r.service';
import { AppSettingsService } from '../services/app-settings.service';
import { ChatService } from '../services/chat.service';
import { CustomAuthService } from '../services/custom-auth.service';
import { AppSettings } from '../models/app-settings.model';
import { ChatMessage } from '../models/chat-message.model';

@Component({
  selector: 'app-chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  appSettings: AppSettings | undefined;
  clearChatHistory: string;
  chatHistory: ChatMessage[] = [];
  chatMessage: string;
  user: SocialUser;

  @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any>;
  @ViewChild('chatInputBox', { read: ElementRef }) public chatInputBox: ElementRef<any>;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appSettingsService: AppSettingsService,
    private authService: CustomAuthService,
    public chatService: ChatService) { }

  ngOnInit() {
    this.clearChatHistory = this.route.snapshot.paramMap.get('clearChatHistory');
    if (!!this.clearChatHistory && this.clearChatHistory.toLocaleLowerCase() == 'true'){
      this.chatService.deleteChatHistory();
    }

    this.appSettingsService.appSettings.subscribe(appSettings => {
      this.appSettings = appSettings;
      this.chatInputBox.nativeElement.focus();
    })

    this.authService.getCurrentUser().subscribe((data) => {
      this.user = data;
    });
    
    if (!this.user) {
      alert("Please log in first, thanks!.");
      this.router.navigate(['home']);
    }

    this.chatMessage = '';
  }

  public chatClick() {    
    if (this.chatMessage == ''){
      return;
    }

    var apiChatMessage = new ChatMessage();
    apiChatMessage.user = this.user;
    apiChatMessage.message = this.chatMessage;
    apiChatMessage.dateSent = new Date();
    
    this.chatService.postChatMessage(apiChatMessage);

    this.chatMessage = '';
    this.scrollBottom();
    this.chatInputBox.nativeElement.focus();
  }

  public scrollBottom() {
    console.log(this.scroll.nativeElement.scrollTop);
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }
}
