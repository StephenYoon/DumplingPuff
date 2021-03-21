import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaruSkiesGameComponent } from './waru-skies-game/waru-skies-game.component';



@NgModule({
  declarations: [WaruSkiesGameComponent],
  imports: [
    CommonModule
  ],
  exports: [
    WaruSkiesGameComponent
  ]
})
export class WaruSkiesModule { }
