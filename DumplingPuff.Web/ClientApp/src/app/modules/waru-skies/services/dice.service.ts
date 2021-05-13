import { Injectable } from '@angular/core';

import { WaruSkiesModule } from '../waru-skies.module';
import { Dice } from '../models/dice';
import { DiceSetCollection } from '../data/diceSetCollection';

@Injectable({
  providedIn: WaruSkiesModule
})
export class DiceService {

  constructor() { }

  calculateDiceRoll(diceSetKey: string): Dice {
    let diceSet: Dice = DiceSetCollection[diceSetKey];
    let randomIndex = 1; // TODO: this is not very random, update this
    return diceSet[randomIndex];
  }

  getDiceImagePrefix(diceSetKey: string): string {
    let imagePrefix: string;
    switch(diceSetKey) { 
      case 'regular': {
        imagePrefix = diceSetKey;
        break; 
      }
      case 'boosted': {
        imagePrefix = diceSetKey;
        break;
      }
      case 'notGood': {
        imagePrefix = diceSetKey;
        break;
      }
      case 'extraGoodness': {
        imagePrefix = diceSetKey;
        break;
      }
      default: {
        imagePrefix = diceSetKey;
        break;
      }
    }

    return imagePrefix;
  }

}