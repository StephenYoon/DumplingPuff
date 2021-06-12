import { Dice } from '../models/dice';
import { DiceSet } from '../models/diceSet';

export class DiceSetCollection {
  regular: DiceSet = {
    display: "regular",
    description: "regular",
    dices: [
      { id: 1, display: "1", value: 1 },
      { id: 2, display: "2", value: 2 },
      { id: 3, display: "3", value: 3 },
      { id: 4, display: "4", value: 4 },
      { id: 5, display: "5", value: 5 },
      { id: 6, display: "6", value: 6 }
    ]
  };

  boosted: DiceSet = {
    display: "boosted",
    description: "boosted",
    dices: [
      { id: 1, display: "1+", value: 2 },
      { id: 2, display: "2+", value: 3 },
      { id: 3, display: "3+", value: 4 },
      { id: 4, display: "4+", value: 5 },
      { id: 5, display: "5+", value: 6 },
      { id: 6, display: "6+", value: 7 }
    ]
  };
  
  notGood: DiceSet = {
    display: "notGood",
    description: "notGood",
    dices: [
      { id: 1, display: "1-", value: 0 },
      { id: 2, display: "2-", value: 1 },
      { id: 3, display: "3-", value: 2 },
      { id: 4, display: "4-", value: 3 },
      { id: 5, display: "5-", value: 4 },
      { id: 6, display: "6-", value: 5 }
    ]
  };
  
  extraGoodness: DiceSet = {
    display: "extraGoodness",
    description: "extraGoodness",
    dices: [
      { id: 1, display: "1", value: 1 },
      { id: 2, display: "2", value: 2 },
      { id: 3, display: "3", value: 3 },
      { id: 4, display: "4", value: 4 },
      { id: 5, display: "5", value: 5 },
      { id: 6, display: "6", value: 6 },
      { id: 7, display: "7", value: 7 },
      { id: 8, display: "8", value: 8 }
    ]
  };

  coin: DiceSet = {
    display: "Coin",
    description: "Coin flip for heads or tails",
    dices: [
      { id: 0, display: "?", value: 0 },
      { id: 1, display: "Heads", value: 1 },
      { id: 2, display: "Tails", value: 2 }
    ]
  };
}
