using System;
using System.Collections.Generic;
using System.Linq;

namespace DumplingPuff.Web.Models.Chat
{
    public class ChatGroup
    {
        public static string DumplingPuffMainChatGroupId = "dumpling-puff-chat-room";

        public ChatGroup(string groupId)
        {
            Id = groupId;
            Messages = new List<ChatMessage>();
            Users = new List<SocialUser>();
        }

        public string Id { get; set; }

        public List<ChatMessage> Messages { get; set; }

        public List<SocialUser> Users { get; set; }
    }
}
