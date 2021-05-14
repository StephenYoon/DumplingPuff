import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiceService } from '@app/services/dice.service';

import { WaruSkiesGameComponent } from './components/waru-skies-game/waru-skies-game.component';
import { DiceComponent } from './components/dice/dice.component';

@NgModule({
  declarations: [
    WaruSkiesGameComponent,
    DiceComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    DiceService
  ],
  exports: [
    WaruSkiesGameComponent
  ]
})
export class WaruSkiesModule { }
