import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocialUser } from 'angularx-social-login';

import { CustomAuthService } from '@app/services/custom-auth.service';

import { Dice } from '@modules/waru-skies/models/dice';
import { DiceService } from '@app/services/dice.service';
import { DiceSetCollection } from '@modules/waru-skies/data/diceSetCollection';

@Component({
  selector: 'app-waru-skies-game',
  templateUrl: './waru-skies-game.component.html',
  styleUrls: ['./waru-skies-game.component.scss']
})
export class WaruSkiesGameComponent implements OnInit, OnDestroy {
  
  public player: SocialUser;
  public playerDiceSet: Dice[];
  public diceSetKey: string = "regular";

  private diceService: DiceService;
  private diceSetCollection: DiceSetCollection = new DiceSetCollection;
  
  constructor(
    private customAuthService: CustomAuthService
  ) { }

  ngOnInit(): void {
    this.playerDiceSet = [
      this.diceSetCollection[this.diceSetKey].dices[0],      
      this.diceSetCollection[this.diceSetKey].dices[1],
      this.diceSetCollection[this.diceSetKey].dices[2]
    ];

    this.player = this.customAuthService.getUser();
  }

  ngOnDestroy(): void {
    // if (this.appSettingsSubscription) this.appSettingsSubscription.unsubscribe();
    // if (this.chatGroupSubscription) this.chatGroupSubscription.unsubscribe();
  }
  
  getPlayerDiceSet(): Dice[] {
    return this.playerDiceSet;
  }
  
  // Get a new set of dice
  // TODO: opportunities to refactor this below, but for now it's "okay"
  rollDice(dices: Dice[]) {
    for (let i = 0; i < this.playerDiceSet.length; i++) {
      let randomIndex = this.randomIntFromInterval(1, 6);
      this.playerDiceSet[i] = this.diceSetCollection[this.diceSetKey].dices[randomIndex - 1]
    }
  }

  // Random number generator, min and max included.
  randomIntFromInterval(min, max): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
