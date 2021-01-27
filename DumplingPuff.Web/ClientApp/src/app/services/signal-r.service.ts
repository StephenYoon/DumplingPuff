import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";  // or from "@aspnet/signalr" if you are using an older library

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: string;
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
      console.log(data);
    });
  }

  public messageBroadcast = () => {
    this.hubConnection.invoke('broadcastMessage', this.data)
    .catch(err => console.error(err));
  }
}