import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ChatMessage } from '../models/chat-message.model';
import { SocialUser } from 'angularx-social-login';

const apiPath = 'api/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatHistory$: BehaviorSubject<ChatMessage[]>;
  userHistory$: BehaviorSubject<SocialUser[]>;

  constructor(private http: HttpClient) {
    this.chatHistory$ = new BehaviorSubject<ChatMessage[]>([]);
    this.userHistory$ = new BehaviorSubject<SocialUser[]>([]);
  }

  get(): Observable<string> {
    var options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.get<string>(apiPath, options)
      .pipe(map(res => {
          //console.log(res);
          return res;
      }));
  }

  getChatHistory(): Observable<ChatMessage[]> {
    var options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.get<ChatMessage[]>(`${apiPath}/history`,  options)
      .pipe(map(chatHistory => {
          this.chatHistory$.next(chatHistory);
          return chatHistory;
      }));
  }

  postChatMessage(chatMessage: ChatMessage): Observable<string> {
    var options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<string>(apiPath, chatMessage,  options)      
      .pipe(map(res => {
        return res;
    }));
  }
  
  deleteChatHistory(): void {
    var options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    this.http.delete<string>(apiPath,  options)
      .subscribe(res => {
        console.log(res);
      })
  }
}