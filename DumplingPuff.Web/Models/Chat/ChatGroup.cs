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
        }

        public string Id { get; set; }

        public List<ChatMessage> Messages { get; set; }

        public List<SocialUser> Users 
        {
            get 
            {
                var allUsers = Messages != null
                    ? Messages.Select(m => m.User).ToList()
                    : new List<SocialUser>();

                var distinctUsers = allUsers
                  .GroupBy(u => u.Email.ToLowerInvariant())
                  .Select(g => g.First())
                  .ToList();

                return distinctUsers;
            }
        }
    }
}
