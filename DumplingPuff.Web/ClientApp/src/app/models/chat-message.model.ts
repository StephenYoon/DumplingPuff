import { SocialUser } from "angularx-social-login";

export class ChatMessage {
  user: SocialUser;
  message: string;
  dateSent: Date;
}