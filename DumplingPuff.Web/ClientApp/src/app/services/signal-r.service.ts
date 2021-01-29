import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";  // or from "@aspnet/signalr" if you are using an older library
import { ChatMessage } from '../models/chat-message.model';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: ChatMessage;
  private hubConnection: signalR.HubConnection

  constructor(private chatService: ChatService) { }  
  
  public startConnection = (baseApiUrl: string) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(baseApiUrl + '/chat')
                            .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }
  
  public chatMessageListener = () => {
    this.hubConnection.on('broadcastChatMessage', (data) => {
      this.data = data;
      console.log(data);
    });
  }

  public chatHistoryListener = () => {
    this.hubConnection.on('broadcastChatHistory', (chatHistory) => {
      //console.log(chatHistory);
      this.chatService.chatHistory$.next(chatHistory);
    });
  }

  // NOTE: not sure about this one
  public chatMessageBroadcast = (message: string) => {
    this.hubConnection.invoke('broadcastChatMessage', message)
      .catch(err => {
        console.error(err)
    });
  }
}