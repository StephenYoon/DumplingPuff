import { SocialUser } from "angularx-social-login";
import { GameState } from "./game-state.model";

export class GameGroup {
  id: string;
  gameStates: GameState[];
  users: SocialUser[];
  activeUsersByEmail: string[];
}