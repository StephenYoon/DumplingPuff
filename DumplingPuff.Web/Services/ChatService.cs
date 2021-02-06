using System;
using System.Collections.Generic;
using System.Linq;
using DumplingPuff.Web.Models;
using DumplingPuff.Web.Models.Chat;

namespace DumplingPuff.Web.Services
{
    public class ChatService : IChatService
    {
        private List<ChatGroup> _chatGroups;

        public ChatService()
        {
            _chatGroups = new List<ChatGroup>();

            // Should always have the main chat room
            ValidateMainChatRoom();
        }

        public ChatGroup GetChatGroup(string groupId)
        {
            var chatGroup = _chatGroups.FirstOrDefault(g => g.Id.Equals(groupId, StringComparison.InvariantCultureIgnoreCase));
            return chatGroup;
        }

        public void AddChatMessageToGroup(string groupId, ChatMessage message)
        {
            if (message.User == null)
            {
                message.User = new SocialUser()
                {
                    Email = "guest@gmail.com",
                    Name = "Guest",
                    FirstName = "Guest",
                    LastName = ""
                };
            }

            var chatGroup = GetChatGroup(groupId);

            if (chatGroup == null)
            {
                chatGroup = new ChatGroup(groupId);
                _chatGroups.Add(chatGroup);
            }
            chatGroup.Messages.Add(message);
        }

        public void ClearChatGroupMessages(string groupId)
        {
            var chatGroup = GetChatGroup(groupId);
            chatGroup.Messages.Clear();
        }

        private void ValidateMainChatRoom()
        {
            // Should always have the main chat room
            if (!_chatGroups.Any(g => g.Id.Equals(ChatGroup.DumplingPuffMainChatGroupId, StringComparison.InvariantCultureIgnoreCase)))
            {
                _chatGroups.Add(new ChatGroup(ChatGroup.DumplingPuffMainChatGroupId));
            }
        }
    }
}
