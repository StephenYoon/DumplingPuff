import { SocialUser } from "angularx-social-login";
import { ChatMessage } from "./chat-message.model";

export class ChatGroup {
  id: string;
  messages: ChatMessage[];
  users: SocialUser[];
  activeUsersByEmail: string[];
}