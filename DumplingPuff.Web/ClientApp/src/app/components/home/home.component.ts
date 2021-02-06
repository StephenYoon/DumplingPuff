import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private clearChatGroup: string;  

  constructor(
    private route: ActivatedRoute
  ) { }
  
  ngOnInit() {    
    this.clearChatGroup = this.route.snapshot.queryParamMap.get('clearChatGroup');
    if (!!this.clearChatGroup && this.clearChatGroup.toLocaleLowerCase() == 'true'){
      // TODO: ...
    }
  }
}
