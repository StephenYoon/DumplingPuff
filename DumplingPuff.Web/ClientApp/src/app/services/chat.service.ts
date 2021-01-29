import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';
import { map } from 'rxjs/operators';

const apiPath = 'api/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _chatHistory$: BehaviorSubject<ChatMessage[]>; // TODO: coming soon...

  constructor(private http: HttpClient) { }

  get(): Observable<string> {
    var options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.get<string>(apiPath, options)
      .pipe(map(res => {
          //console.log(res);
          return res;
      }));
  }

  // TODO: coming soon...
  getChatHistory(): Observable<ChatMessage[]> {
    var options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.get<ChatMessage[]>(apiPath + '/history',  options)
      .pipe(map(chatHistory => {
          this._chatHistory$.next(chatHistory);
          return chatHistory;
      }));
  }

  postChatMessage(chatMessage: ChatMessage): void {
    var options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    this.http.post<string>(apiPath, chatMessage,  options)
      .subscribe(res => {
        //console.log(res);
      })
  }
}