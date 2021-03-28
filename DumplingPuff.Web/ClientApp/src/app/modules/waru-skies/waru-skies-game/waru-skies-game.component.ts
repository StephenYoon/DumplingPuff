import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppSettings } from '@app/models/app-settings.model';
import { ChatGroup } from '@app/models/chat-group.model';
import { AppSettingsService } from '@app/services/app-settings.service';
import { ChatService } from '@app/services/chat.service';

@Component({
  selector: 'app-waru-skies-game',
  templateUrl: './waru-skies-game.component.html',
  styleUrls: ['./waru-skies-game.component.scss']
})
export class WaruSkiesGameComponent implements OnInit, OnDestroy {
  
  appSettings: AppSettings;
  appSettingsSubscription: any;
  chatGroup: ChatGroup;
  chatGroupSubscription: any;

  constructor(
    private appSettingsService: AppSettingsService,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.appSettingsSubscription) this.appSettingsSubscription.unsubscribe();
    if (this.chatGroupSubscription) this.chatGroupSubscription.unsubscribe();
  }

  public testApi(): void {
    this.appSettingsSubscription = this.appSettingsService.appSettings.subscribe(appSettings => {
      this.appSettings = appSettings;
      });
  }
  
  public testAp2i(): void {
    this.chatGroupSubscription = this.chatService.getChatGroup('dumpling-puff-chat-room').subscribe(chat => {
      this.chatGroup = chat;
      });
  }
}
