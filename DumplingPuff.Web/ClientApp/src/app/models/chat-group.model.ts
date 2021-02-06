import { SocialUser } from "angularx-social-login";
import { ChatMessage } from "./chat-message.model";

export class ChatGroup {
  name: string;
  messages: ChatMessage[];
  users: SocialUser[];
}