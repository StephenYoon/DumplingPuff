import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';
import { ChatMessage } from '../models/chat-message.model';
import { SocialUser } from 'angularx-social-login';

const apiPath = 'api/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatHistory$: BehaviorSubject<ChatMessage[]>;
  userHistory$: BehaviorSubject<SocialUser[]>;

  user: SocialUser;
  defaultHeaders: HttpHeaders;

  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) {
    this.chatHistory$ = new BehaviorSubject<ChatMessage[]>([]);
    this.userHistory$ = new BehaviorSubject<SocialUser[]>([]);
  }

  get(): Observable<string> {
    return this.apiService.get<string>(apiPath);
  }

  getChatHistory(): Observable<ChatMessage[]> {
    return this.apiService.get<ChatMessage[]>(`${apiPath}/history`)
      .pipe(map(data => {
          this.chatHistory$.next(data);
          return data;
      }));
  }

  postChatMessage(chatMessage: ChatMessage): Observable<string> {
    return this.apiService.post<string, ChatMessage>(apiPath, chatMessage);
  }
  
  deleteChatHistory(): Observable<string> {
    return this.apiService.delete<string, string>(apiPath, 'chatRoom');
  }
}