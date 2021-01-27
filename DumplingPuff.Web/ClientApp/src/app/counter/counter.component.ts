import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../services/signal-r.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html'
})
export class CounterComponent implements OnInit {
  public currentCount = 0;

  constructor(public signalRService: SignalRService, private http: HttpClient) { }

  ngOnInit() {
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

  public incrementCounter() {
    this.currentCount++;
    this.startHttpRequest();
  }
}
