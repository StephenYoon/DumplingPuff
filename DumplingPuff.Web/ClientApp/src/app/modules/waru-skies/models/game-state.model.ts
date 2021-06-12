import { SocialUser } from "angularx-social-login";

export class GameState {
  user: SocialUser;
  progress: number;
  diceIndex: number;
  turnCompleted: boolean;
  dateSent: Date;
}