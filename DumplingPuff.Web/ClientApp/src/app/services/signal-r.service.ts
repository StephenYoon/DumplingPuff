import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";  // or from "@aspnet/signalr" if you are using an older library

import { ChatService } from './chat.service';
import { SignedInUserService } from './signed-in-user.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection

  constructor(
    private chatService: ChatService,
    private signedInUserService: SignedInUserService
  ) { }  
  
  public startConnection = (baseApiUrl: string) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(baseApiUrl + '/chat')
                            .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }  

  public chatGroupListener = () => {
    this.hubConnection.on('broadcastChatGroup', (data) => {
      this.chatService.updateChatGroup(data);
    });
  }

  // NOTE: not sure about this one
  /*
  public chatMessageBroadcast = (message: string) => {
    this.hubConnection.send('broadcastChatGroup', message)
      .catch(err => {
        console.error(err)
    });
  }
  */

  public signedInUserListener = () => {
    this.hubConnection.on('broadcastSignedInUsers', (data) => {
      console.log(`broadcastSignedInUsers: Number of signedInUsers ${JSON.stringify(data.length)}`);
      this.signedInUserService.updateUsers(data);
    });
  }
  
  public destroy(): void {
    this.hubConnection.stop();
  }
}