import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private clearChatHistoryParam: string;  

  constructor(
    private route: ActivatedRoute,
    public chatService: ChatService) { }
  
  ngOnInit() {    
    this.clearChatHistoryParam = this.route.snapshot.queryParamMap.get('clearChatHistory');
    if (!!this.clearChatHistoryParam && this.clearChatHistoryParam.toLocaleLowerCase() == 'true'){
      this.chatService.deleteChatHistory().subscribe((res) => {
        console.log(res);
      });
    }
  }
}
