import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignalRServiceResolver } from './services/signal-r-service.resolver';
import { AuthGuard } from './authentication/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { FetchDataComponent } from './components/fetch-data/fetch-data.component';
import { WaruSkiesGameComponent } from './modules/waru-skies/waru-skies-game/waru-skies-game.component';

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
  { path: 'chatbox/:id', component: ChatBoxComponent, canActivate : [AuthGuard] },
  { path: 'fetch-data', component: FetchDataComponent },
  { path: 'waru-skies/:id', 
      component: WaruSkiesGameComponent,
      canActivate : [AuthGuard],
      loadChildren: () => import('@modules/waru-skies/waru-skies.module').then((m) => m.WaruSkiesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
