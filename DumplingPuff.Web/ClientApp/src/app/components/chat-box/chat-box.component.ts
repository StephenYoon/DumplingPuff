import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SocialUser } from 'angularx-social-login';

import { AppSettingsService } from '../../services/app-settings.service';
import { ChatService } from '../../services/chat.service';
import { CustomAuthService } from '../../services/custom-auth.service';
import { SignedInUserService } from '../../services/signed-in-user.service';

import { AppSettings } from '../../models/app-settings.model';
import { ChatMessage } from '../../models/chat-message.model';
import { ChatGroup } from '../../models/chat-group.model';

import * as moment from 'moment';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit, OnDestroy {
  appSettings: AppSettings;
  chatMessage: string = '';
  userSearch: string = '';
  user: SocialUser;
  signedInUsers: SocialUser[] = [];
  selectedUsers: SocialUser[] = [];
  chatUsers: SocialUser[] = [];

  chatGroupId: string = '';
  chatGroup: ChatGroup;

  appSettingsSubscription: any;
  currentUserSubsription: any;
  chatServiceSubscription: any;
  signedInUserServiceSubscription: any;

  @ViewChild('chatContainerScroll', { read: ElementRef }) public scroll: ElementRef<any>;
  @ViewChild('chatInputBox', { read: ElementRef }) public chatInputBox: ElementRef<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appSettingsService: AppSettingsService,
    private authService: CustomAuthService,
    public chatService: ChatService,
    public signedInUserService: SignedInUserService) { }

    ngOnInit() {      
      this.authService.refreshGoogleToken();

      // TODO: consider MergeMap, ForkJoin and/or combineLatest
      // MergeMap, ForkJoin > https://coryrylan.com/blog/angular-multiple-http-requests-with-rxjs
      // combineLatest > https://stackoverflow.com/questions/44004144/how-to-wait-for-two-observables-in-rxjs
      this.route.params.subscribe(params => {
        this.appSettingsSubscription = this.appSettingsService.appSettings.subscribe(appSettings => {
          this.appSettings = appSettings;          
          this.chatGroupId = params.id || null;

          this.chatServiceSubscription = this.chatService.getChatGroup(this.chatGroupId).subscribe((chatGroup) => {
            if (chatGroup) {
              this.chatUsers = chatGroup.users;
              this.chatGroup = chatGroup;
              this.scrollBottom();
            }
          });

          this.chatServiceSubscription = this.chatService.chatGroup$.subscribe((chatGroup) => {
            if (chatGroup) {
              this.chatUsers = chatGroup.users;
              this.chatGroup = chatGroup;
              this.scrollBottom();
            }
          });

          if (!this.chatGroupId || this.chatGroupId == '') {
            this.chatGroupId = this.appSettings.defaultChatGroupId;
          }        

          this.currentUserSubsription = this.authService.getCurrentUser().subscribe((data) => {
            this.user = data;
          });
          
          this.signedInUserServiceSubscription = this.signedInUserService.users$.subscribe((data) => { 
              this.signedInUsers = data; 
          });

          
          if (!this.user) {
            alert("Please log in first, thanks!");
            this.router.navigate(['home']);
          }          
        })
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
  
    public getFormattedUserTime(): string {
      return moment().format('h:mm:ss a')
    }

    public filteredUsers(): SocialUser[] {

      // Get list of users from chat history
      var fullUserList: SocialUser[] = [];

      // Add users in the group chat
      if (this.chatUsers) {
        this.chatUsers.forEach(u => {
          fullUserList.push(u);
        });
      }
      
      // Add signed-in users
      this.signedInUsers.forEach(su => {
        var exists = this.userExists(su, fullUserList);
        if (!exists) {
          fullUserList.push(su);
        }
      });

      // Filter list if applicable
      if (!this.userSearch || this.userSearch.trim() == '') {
        return fullUserList;
      }

      var lowerCaseSearchTerm = this.userSearch.toLowerCase();
      var filteredList = fullUserList.filter(user => {
         return user.name.toLowerCase().includes(lowerCaseSearchTerm);
      });

      return filteredList;
    }

    public userExists(user: SocialUser, userList: SocialUser[]): boolean {
      var exists = false;
      var filteredList = userList.filter(u => {
        return user.email.toLowerCase() == u.email.toLowerCase();
      });

      return filteredList && filteredList.length > 0;
    }

    public userOnline(user: SocialUser): boolean {
        var exists = this.userExists(user, this.signedInUsers);
        return exists;
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
      
      this.chatService.postMessageToChatGroup(this.chatGroupId, apiChatMessage).subscribe((data) => {
        this.scrollBottom();
      });
  
      this.chatMessage = '';
    }
  
    public scrollBottom() {
      this.chatInputBox.nativeElement.focus();
      this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
      //this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight - this.scroll.nativeElement.clientHeight;
    }
    
    public ngOnDestroy() {
      // Set user as offline by removing user from signedInUser list
      this.signedInUserService.removeUser(this.user.email);

      // Clean up
      if (this.appSettingsSubscription) this.appSettingsSubscription.unsubscribe();
      if (this.currentUserSubsription) this.currentUserSubsription.unsubscribe();
      if (this.signedInUserServiceSubscription) this.signedInUserServiceSubscription.unsubscribe();
      if (this.chatServiceSubscription) this.chatServiceSubscription.unsubscribe();
    }
  }
