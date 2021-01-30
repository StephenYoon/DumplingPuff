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
  

  public chatHistoryListener = () => {
    this.hubConnection.on('broadcastChatHistory', (data) => {
      this.chatService.chatHistory$.next(data);
    });
  }

  // NOTE: not sure about this one
  /*
  public chatMessageBroadcast = (message: string) => {
    this.hubConnection.invoke('broadcastChatMessage', message)
      .catch(err => {
        console.error(err)
    });
  }
  */

  public signedInUserListener = () => {
    this.hubConnection.on('broadcastSignedInUsers', (data) => {
      console.log(`broadcastSignedInUsers: ${data}`);
      this.signedInUserService.users$ = data;
    });
  }
}