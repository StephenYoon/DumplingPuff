import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";  // or from "@aspnet/signalr" if you are using an older library
import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: ChatMessage;
  public chatHistory: ChatMessage[] = [];
  private hubConnection: signalR.HubConnection

  constructor() { }  
  
  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('https://localhost:5001/chat')
                            .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }
  
  public messageListener = () => {
    this.hubConnection.on('broadcastMessage', (data) => {
      this.data = data;
      this.chatHistory.push(data);
      console.log(data);
    });
  }

  public messageBroadcast = (message: string) => {
    this.hubConnection.invoke('broadcastMessage', message)
    .catch(err => {
      console.error(err)
    });
  }
}