import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SocialUser } from 'angularx-social-login';
import { SignalRService } from '../services/signal-r.service';
import { CustomAuthService } from '../services/custom-auth.service';
import { ChatMessage } from '../models/chat-message.model';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
  currentCount = 0;
  chatMessage: string;
  user: SocialUser;

  constructor(
    public signalRService: SignalRService, 
    private authService: CustomAuthService,
    private http: HttpClient) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((data) => {
      this.user = data;      

      if (!this.user) {
        this.user = new SocialUser;
        this.user.email = "guest@gmail.com";
        this.user.name = "Guest";
        this.user.firstName = "Guest";
        this.user.lastName = "";
        this.user.photoUrl = "https://static.wikia.nocookie.net/food-fantasy/images/9/98/FA-Green_Dumpling.png/revision/latest/top-crop/width/360/height/450?cb=20181130145704";
      }
    });
    this.chatMessage = '';
    this.signalRService.startConnection();
    this.signalRService.messageListener();
    this.startHttpRequest();
  }

  private startHttpRequest = () => {
    this.http.get('https://localhost:5001/api/chat')
      .subscribe(res => {
        console.log(res);
      })
  }

  public chatClick() {
    //this.signalRService.messageBroadcast(this.chatMessage);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    }); 
    var options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    var apiChatMessage = new ChatMessage();
    apiChatMessage.user = this.user;
    apiChatMessage.message = this.chatMessage;
    this.http.post<string>('https://localhost:5001/api/chat', apiChatMessage,  {headers: headers})
      .subscribe(res => {
        console.log(res);
      })
  }

  public incrementCounter() {
    this.currentCount++;
    this.startHttpRequest();
  }
}
