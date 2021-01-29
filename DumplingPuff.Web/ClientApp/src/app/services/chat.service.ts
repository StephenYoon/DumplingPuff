import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings } from '../models/app-settings.model';
import { ChatMessage } from '../models/chat-message.model';
import { AppSettingsService } from './app-settings.service';
import { map } from 'rxjs/operators';
import { SocialUser } from 'angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  appSettings: AppSettings | undefined;
  private _chatHistory$: BehaviorSubject<ChatMessage[]>; // TODO: coming soon...

  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {    
    this.appSettingsService.appSettings.subscribe(appSettings => {
      this.appSettings = appSettings;
    })
  }

  get(): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    }); 

    return this.http.get<string>(this.appSettings.baseApiUrl + '/api/chat',  {headers: headers})
      .pipe(map(res => {
          console.log(res);
          return res;
      }));
  }

  // TODO: coming soon...
  getChatHistory(): Observable<ChatMessage[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    }); 

    return this.http.get<ChatMessage[]>(this.appSettings.baseApiUrl + '/api/chat/history',  {headers: headers})
      .pipe(map(chatHistory => {
          this._chatHistory$.next(chatHistory);
          return chatHistory;
      }));
  }

  postChatMessage(chatMessage: ChatMessage): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    }); 
    var options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    this.http.post<string>(this.appSettings.baseApiUrl + '/api/chat', chatMessage,  {headers: headers})
      .subscribe(res => {
        console.log(res);
      })
  }
}