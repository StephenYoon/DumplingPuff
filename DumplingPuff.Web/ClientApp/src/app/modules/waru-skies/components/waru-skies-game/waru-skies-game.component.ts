import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocialUser } from 'angularx-social-login';

import { CustomAuthService } from '@app/services/custom-auth.service';
import { SignalRWaruSkiesService } from '@app/services/signal-r-waru-skies.service';

import { Dice } from '@app/models/dice';
import { DiceService } from '@app/services/dice.service';
import { DiceSetCollection } from '@app/data/diceSetCollection';
import { GameGroup } from '../../models/game-group.model';
import { GameState } from '../../models/game-state.model';
import { GameUpdateType } from '../../models/game-update-type';

@Component({
  selector: 'app-waru-skies-game',
  templateUrl: './waru-skies-game.component.html',
  styleUrls: ['./waru-skies-game.component.scss']
})
export class WaruSkiesGameComponent implements OnInit, OnDestroy {
  
  public user: SocialUser;
  public playerDiceSet: Dice[];
  public diceSetKey: string = "coin";

  private diceSetCollection: DiceSetCollection = new DiceSetCollection;
  private maxCoinFlipsPerTurn: number = 2;

  public stepsProgress: number;
  public currentNumberOfFlips: number;
  
  defaultGroupId: string = 'waru-skies-game-room';
  groupId: string = '';
  gameGroup: GameGroup;
  
  gameGroupSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private customAuthService: CustomAuthService,
    public signalRService: SignalRWaruSkiesService
  ) { }

  ngOnInit(): void {
    
    this.user = this.customAuthService.getUser();
    this.stepsProgress = 0;
    this.currentNumberOfFlips = 0;
    this.playerDiceSet = [];
    this.route.params.subscribe(params => {
      
      this.groupId = params.id || this.defaultGroupId;
      this.signalRService.userJoinedGroup(this.groupId);        
      this.gameGroupSubscription = this.signalRService.gameGroup$.subscribe((gameGroup) => {
        if (gameGroup) {
          this.gameGroup = gameGroup;
        }
      });        
    });
  }

  ngOnDestroy(): void {
    // Set user as offline by removing user from signedInUser list
    this.signalRService.userLeftGroup(this.groupId);
    
    // if (this.appSettingsSubscription) this.appSettingsSubscription.unsubscribe();
    if (this.gameGroupSubscription) this.gameGroupSubscription.unsubscribe();
  }
  
  public getGameStates(): GameState[] {
    return this.gameGroup.gameStates;
  }

  public getUserGameState(): GameState {
    var userGameState = this.gameGroup.gameStates.find(gameState => {
      return gameState.user.email.toLowerCase() == this.user.email.toLowerCase();
    });

    return userGameState;
  }

  getPlayerDiceSet(): Dice[] {
    return this.playerDiceSet;
  }

  getDiceDisplayOverrideValue(): string {
    var userGameState = this.getUserGameState();

    return userGameState.turnCompleted
      ? ""
      : "?";
  }

  resetGame(): void {
    this.playerDiceSet = [];
    this.signalRService.UpdateGame(this.groupId, GameUpdateType.ResetGame);
  }

  endTurn(): void {
    var userGameState = this.getUserGameState();

    if (!userGameState){
      return;
    }

    this.playerDiceSet = [];
    this.currentNumberOfFlips = 0;
    userGameState.turnCompleted = true;
    this.signalRService.UpdateGroup(this.groupId, userGameState);
  }

  // Get a new set of dice
  // TODO: opportunities to refactor this below, but for now it's "okay"
  rollDice() {
    var diceSet = this.diceSetCollection[this.diceSetKey].dices;
    var maxLength = 2;
    var progressMade = 0;
    
    this.currentNumberOfFlips++;
    
    var userGameState = this.getUserGameState();      
    if (!userGameState){
      return;
    }
    
    // Flip coin if user is within maxCoinFlipsPerTurn
    if (!userGameState.turnCompleted && this.currentNumberOfFlips <= this.maxCoinFlipsPerTurn) {
      let randomDiceIndex = this.randomIntFromInterval(1, maxLength);
      let diceResult = diceSet[randomDiceIndex];

      if (this.playerDiceSet.length == 0) {
        this.playerDiceSet.push(diceResult);
      } else {
        this.playerDiceSet[0] = diceResult;
      }

      if (randomDiceIndex == 1) {
        progressMade = 1;
      } else {
        // If tails, player turn ends and loses any progress made this turn
        progressMade = 0;
        userGameState.turnCompleted = true;
      }
    }
    
    
    // Update user's game state
    userGameState.progress = userGameState.progress + progressMade;
    if (this.currentNumberOfFlips >= this.maxCoinFlipsPerTurn) {
      userGameState.turnCompleted = true;
      this.currentNumberOfFlips = 0;
    }
    this.signalRService.UpdateGroup(this.groupId, userGameState);
  }

  // Random number generator, min and max included.
  randomIntFromInterval(min, max): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  public userPhotoSrcUrl(user: SocialUser): string {
    return user.photoUrl ?? '../../../assets/default_avatar.JPG';
  }

  public userOnline(user: SocialUser): boolean {
    var foundIndex = this.gameGroup.activeUsersByEmail.findIndex(activeUserEmail => activeUserEmail.toLowerCase() == user.email.toLowerCase());
    return foundIndex >= 0;
  }
}
