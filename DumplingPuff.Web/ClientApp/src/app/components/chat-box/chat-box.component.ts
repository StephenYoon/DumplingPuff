import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SocialUser } from 'angularx-social-login';

import { ChatService } from '../../services/chat.service';
import { CustomAuthService } from '../../services/custom-auth.service';
import { SignalRService } from 'src/app/services/signal-r.service';

import { ChatMessage } from '../../models/chat-message.model';
import { ChatGroup } from '../../models/chat-group.model';
import * as moment from 'moment';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit, OnDestroy {
  chatMessage: string = '';
  userSearch: string = '';
  user: SocialUser;
  selectedUsers: SocialUser[] = [];
  chatUsers: SocialUser[] = [];
  baseUrl: string;

  defaultChatGroupId: string = 'dumpling-puff-chat-room';
  chatGroupId: string = '';
  chatGroup: ChatGroup;

  appSettingsSubscription: any;
  currentUserSubsription: any;
  chatServiceSubscription: any;
  chatGroupSubscription: any;
  @ViewChild('chatContainerScroll', { read: ElementRef }) public scroll: ElementRef<any>;
  @ViewChild('chatInputBox', { read: ElementRef }) public chatInputBox: ElementRef<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customAuthService: CustomAuthService,
    public chatService: ChatService,
    public signalRService: SignalRService) { }

    ngOnInit() {      
      //this.customAuthService.refreshGoogleToken();
      this.baseUrl = environment.baseApiUrl;

      // TODO: consider MergeMap, ForkJoin and/or combineLatest
      // MergeMap, ForkJoin > https://coryrylan.com/blog/angular-multiple-http-requests-with-rxjs
      // combineLatest > https://stackoverflow.com/questions/44004144/how-to-wait-for-two-observables-in-rxjs
      this.route.params.subscribe(params => {
       
        this.chatGroupId = params.id || this.defaultChatGroupId;
        this.user = this.customAuthService.getUser();

        if (this.user != null) {

          // Sign-in user	
          this.signalRService.userJoinedChat(this.chatGroupId);
            
          this.chatGroupSubscription = this.signalRService.chatGroup$.subscribe((chatGroup) => {
            if (chatGroup) {
              this.chatGroup = chatGroup;
              this.updateChatUsers();
              this.scrollBottom();
            }
          });
        }

        if (!this.user) {
          alert("Please log in first, thanks!");
          this.router.navigate(['home']);
        }
          
      });
    }

    public getFormattedDateTime(dateValue: Date): string {
      var timeNow = moment(new Date());
      var timeDiffInHours = timeNow.diff(dateValue, 'days');
      if (timeDiffInHours <= 24) {
        return moment(dateValue).format('LTS');
      }
      
      return moment(dateValue).format('lll');
    }
  
    public getFormattedUserTime(signedInUser: SocialUser): string {
      var msgs = this.chatGroup.messages.filter(msg => msg.user.email.toLowerCase() == signedInUser.email.toLowerCase());

      if (msgs != null && msgs.length) {
        var sortedMsgsByDate = msgs.slice().sort((a, b) => new Date(b.dateSent).getTime() - new Date(a.dateSent).getTime());
        var latestSortedMsgDate = new Date(sortedMsgsByDate[0].dateSent);
        var formattedDate = moment(latestSortedMsgDate).format('h:mm:ss a');
        return formattedDate;
      }

      if (!!this.chatGroup.messages && this.chatGroup.messages.length) {
        var earliestMsgDate = new Date(this.chatGroup.messages[0].dateSent);
        var defaultDate = moment(earliestMsgDate).format('h:mm:ss a');
        return defaultDate;
      }

      return '';
    }

    public getChatMessages(): ChatMessage[] {
      var messages = this.chatGroup.messages.filter((msg) => {return !msg.isHidden;});
      return messages;
    }

    public updateChatUsers(): void {

      // Get list of users from chat history, start with chat users
      if (!this.chatGroup){
        return;
      }

      var chatUserList = this.chatGroup.users.slice();
      
      // Filter list if applicable
      if (!this.userSearch || this.userSearch.trim() == '') {
        this.chatUsers = chatUserList;
        return;
      }

      // Filter list further if search text exists
      var lowerCaseSearchTerm = this.userSearch.toLowerCase();
      var filteredList = chatUserList.filter(user => {
         return user.name.toLowerCase().includes(lowerCaseSearchTerm);
      });

      this.chatUsers = filteredList;
    }

    public userPhotoSrcUrl(user: SocialUser): string {
      return user.photoUrl ?? '../../../assets/default_avatar.JPG';
    }

    public userOnline(user: SocialUser): boolean {      
      var foundIndex = this.chatGroup.activeUsersByEmail.findIndex(activeUserEmail => activeUserEmail.toLowerCase() == user.email.toLowerCase());
      return foundIndex >= 0;
    }

    public isChatLeft(chatUser: SocialUser): boolean {
      var currentUserEmail = this.user.email.trim().toLowerCase();
      var chatUserEmail = chatUser.email.trim().toLowerCase();

      return currentUserEmail == chatUserEmail;
    }

    // Add or remove toggled user
    public selectedUserClick(toggledUser: SocialUser): void {
      var filteredList = this.selectedUsers.filter(user => toggledUser.email.toLowerCase() == user.email.toLowerCase());

      if (!filteredList.length) {
        this.selectedUsers.push(toggledUser);
      } else {
        this.selectedUsers.splice(this.selectedUsers.findIndex(user => toggledUser.email.toLowerCase() == user.email.toLowerCase()), 1)
      }
    }

    public chatClick() {    
      if (this.chatMessage == ''){
        return;
      }
  
      var apiChatMessage = new ChatMessage();
      apiChatMessage.user = this.user;
      apiChatMessage.message = this.chatMessage;
      apiChatMessage.dateSent = new Date();
            
      this.signalRService.sendChatMessage(this.chatGroupId, apiChatMessage);

      this.chatMessage = '';
    }
  
    public scrollBottom() {
      this.chatInputBox.nativeElement.focus();
      this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
      //this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight - this.scroll.nativeElement.clientHeight;
    }
    
    public ngOnDestroy() {
      // Set user as offline by removing user from signedInUser list
      this.signalRService.userLeftChat(this.chatGroupId);

      // Clean up
      if (this.appSettingsSubscription) this.appSettingsSubscription.unsubscribe();
      if (this.currentUserSubsription) this.currentUserSubsription.unsubscribe();
      if (this.chatServiceSubscription) this.chatServiceSubscription.unsubscribe();
      if (this.chatGroupSubscription) this.chatGroupSubscription.unsubscribe();
    }
  }
