import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocialUser } from 'angularx-social-login';

import { CustomAuthService } from '@app/services/custom-auth.service';

import { Dice } from '@app/models/dice';
import { DiceService } from '@app/services/dice.service';
import { DiceSetCollection } from '@app/data/diceSetCollection';

@Component({
  selector: 'app-waru-skies-game',
  templateUrl: './waru-skies-game.component.html',
  styleUrls: ['./waru-skies-game.component.scss']
})
export class WaruSkiesGameComponent implements OnInit, OnDestroy {
  
  public user: SocialUser;
  public playerDiceSet: Dice[];
  public diceSetKey: string = "coin";

  private diceService: DiceService;
  private diceSetCollection: DiceSetCollection = new DiceSetCollection;

  public stepsProgress: number;
  private gameWon: boolean;
  
  constructor(
    private customAuthService: CustomAuthService
  ) { }

  ngOnInit(): void {
    this.playerDiceSet = [
      this.diceSetCollection[this.diceSetKey].dices[0]
    ];

    this.user = this.customAuthService.getUser();

    this.stepsProgress = 0;
    this.gameWon = false;
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
    var maxLength = this.diceSetCollection[this.diceSetKey].dices.length;
    for (let i = 0; i < this.playerDiceSet.length; i++) {
      let randomIndex = this.randomIntFromInterval(1, maxLength);
      this.playerDiceSet[i] = this.diceSetCollection[this.diceSetKey].dices[randomIndex - 1];

      this.processDiceRoll(randomIndex);
    }
  }

  processDiceRoll(diceIndex: number): void {
    if (diceIndex == 1) {
      this.stepsProgress++;
    }

    if (this.stepsProgress >= 10) {
      this.gameWon = true;
    }
  }

  // Random number generator, min and max included.
  randomIntFromInterval(min, max): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  public userPhotoSrcUrl(user: SocialUser): string {
    return user.photoUrl ?? '../../../assets/default_avatar.JPG';
  }

  public userOnline(user: SocialUser): boolean {
    return true;
    // var foundIndex = this.chatGroup.activeUsersByEmail.findIndex(activeUserEmail => activeUserEmail.toLowerCase() == user.email.toLowerCase());
    // return foundIndex >= 0;
  }
}
