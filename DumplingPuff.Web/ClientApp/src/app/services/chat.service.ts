import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';
import { ChatGroup } from '../models/chat-group.model';
import { ChatMessage } from '../models/chat-message.model';
import { SocialUser } from 'angularx-social-login';

const apiPath = 'api/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatGroup$: BehaviorSubject<ChatGroup>;
  userHistory$: BehaviorSubject<SocialUser[]>;

  user: SocialUser;
  defaultHeaders: HttpHeaders;

  constructor(private apiService: ApiService) {
    this.chatGroup$ = new BehaviorSubject<ChatGroup>(null);
    this.userHistory$ = new BehaviorSubject<SocialUser[]>([]);
  }

  getChatGroup(groupId: string): Observable<ChatGroup> {
    return this.apiService.get<ChatGroup>(`${apiPath}/chatgroup/${groupId}`)
      .pipe(map(data => {
          this.chatGroup$.next(data);
          return data;
      }));
  }

  postMessageToChatGroup(groupId: string, chatMessage: ChatMessage): Observable<string> {
    return this.apiService.post<string, ChatMessage>(`${apiPath}/chatgroup/${groupId}`, chatMessage);
  }
  
  deleteChatGroupMessages(groupId: string): Observable<string> {
    return this.apiService.delete<string, string>(`${apiPath}/chatgroup/${groupId}`,'n/a');
  }
}