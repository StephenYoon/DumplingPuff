import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { FetchDataComponent } from './components/fetch-data/fetch-data.component';
import { SignalRServiceResolver } from './services/signal-r-service.resolver';

// const routes: Routes = [
//   { path: '', resolve: { connection: SignalRServiceResolver }, children: [
//     { path: '', pathMatch: 'full' },
//     { path: 'home', component: HomeComponent, redirectTo: '' },
//     { path: 'chatbox', component: ChatBoxComponent },
//     { path: 'fetch-data', component: FetchDataComponent }
//   ] },
// ];

const routes: Routes = [
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'chatbox', component: ChatBoxComponent },
  { path: 'chatbox/:id', component: ChatBoxComponent },
  { path: 'fetch-data', component: FetchDataComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
