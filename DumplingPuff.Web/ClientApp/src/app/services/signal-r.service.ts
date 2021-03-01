import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";  // or from "@aspnet/signalr" if you are using an older library
import { SocialUser } from 'angularx-social-login';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatGroup } from '../models/chat-group.model';
import { ChatMessage } from '../models/chat-message.model';

import { CustomAuthService } from './custom-auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  baseApiUrl: string;
  reconnecting: Subject<boolean> = new Subject();
  chatGroup$: BehaviorSubject<ChatGroup>;
  currentUser: SocialUser;
  chatGroupId: string;
  
  private signalrConnection: signalR.HubConnection;
  private reconnectInterval: NodeJS.Timer;

  constructor(
    private customAuthService: CustomAuthService
  ) {
    this.setupSignalRConnection();
    this.chatGroup$ = new BehaviorSubject<ChatGroup>(null);
  }  
  
  public setupSignalRConnection = () => {
    this.baseApiUrl = environment.baseApiUrl;
    this.signalrConnection = new signalR.HubConnectionBuilder()
                            .withUrl(this.baseApiUrl + '/chat')
                            .build();
                            
    console.log(`BaseApiUrl set to: ${this.baseApiUrl}`);

    this.signalrConnection.on('broadcastChatGroup', (data) => {
      this.chatGroup$.next(data);
    });

    this.signalrConnection.on('broadcastSignedInUsers', (data) => {
      console.log(`broadcastSignedInUsers: Number of signedInUsers ${JSON.stringify(data.length)}`);
    });

    this.signalrConnection.on('notification', (data) => {
      console.log(`${data}`);
    });

    this.signalrConnection.onclose(() => {
      this.reconnectInterval = setInterval(() => {
        this.reconnect();
      }, 2000);
    });
  }
  
  public async connect(): Promise<boolean> {
    console.log('Connecting...');
    const results = await Promise.all([
      this.signalrConnection
        .start()
        .then(() => {
          console.log('Connected!');
        })
        .catch(err => {
          console.error('Error while starting connection: ' + err);
        })
    ]);

    const user = this.customAuthService.getUser(); //results[0];
    if (!!this.currentUser) {
      this.currentUser = user;
      console.log('Got User: ', user.email);
    } else {
      console.log('User not logged in.');
    }
    return true;
  }

  private reconnect(): void {
    console.log('Trying to reconnect');
    this.reconnecting.next(true);
    this.signalrConnection.start().then(() => {
      console.log('Reconnected');
      clearInterval(this.reconnectInterval);
      this.reconnecting.next(false);
    }, () => {
      console.log('Unable to reconnect');
    });
  }

  public sendChatMessage(groupId: string, message: ChatMessage): void {
    this.signalrConnection.send('SendChatMessage', groupId, JSON.stringify(message));
  }

  public async userJoinedChat(groupId: string): Promise<void> {
    this.chatGroupId = groupId;
    var user = this.customAuthService.getUser();
    await this.signalrConnection.send('UserJoinedChat', groupId, JSON.stringify(user));
  }

  public async userReconnected(groupId: string): Promise<void> {
    var user = this.customAuthService.getUser();
    await this.signalrConnection.send('UserReconnected', groupId, JSON.stringify(user));
  }

  public async userLeftChat(groupId: string): Promise<void> {
    this.chatGroupId = null;
    var user = this.customAuthService.getUser();
    await this.signalrConnection.send('UserLeftChat', groupId, JSON.stringify(user));
  }

  public async deleteChat(groupId: string): Promise<void> {
    await this.signalrConnection.send('DeleteChat', groupId);
  }
  
  // NOTE: not sure about this one
  /*
  public chatMessageBroadcast = (message: string) => {
    this.hubConnection.send('updateChatGroup', message)
      .catch(err => {
        console.error(err)
    });
  }
  */
  
  public destroy(): void {
    this.signalrConnection.stop();
  }
}