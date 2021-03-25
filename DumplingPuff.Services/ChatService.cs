using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using DumplingPuff.DataAccess.Repository.Interfaces;
using DumplingPuff.EntityModels.DumplingPuff;
using DumplingPuff.Models;
using DumplingPuff.Models.Chat;
using DumplingPuff.Services.Interfaces;

namespace DumplingPuff.Services
{
    public class ChatService : IChatService
    {
        private List<ChatGroup> _chatGroups;
        private readonly IChatGroupRepository _chatGroupRepository;
        private readonly IChatMessageRepository _chatMessageRepository;
        private readonly IUserService _userService;

        public ChatService(
            IChatGroupRepository chatGroupRepository,
            IChatMessageRepository chatMessageRepository,
            IUserService userService
        )
        {
            _chatGroups = new List<ChatGroup>();
            _chatGroupRepository = chatGroupRepository;
            _chatMessageRepository = chatMessageRepository;
            _userService = userService;

            // Should always have the main chat room
            ValidateMainChatRoom();
        }

        public List<ChatGroup> GetChatGroups()
        {
            return _chatGroups;
        }

        public ChatGroup GetChatGroup(string groupId)
        {
            var chatGroup = _chatGroups.FirstOrDefault(g => g.Id.Equals(groupId, StringComparison.InvariantCultureIgnoreCase));

            if (chatGroup == null)
            {
                chatGroup = new ChatGroup(groupId);
                _chatGroups.Add(chatGroup);
            }

            return chatGroup;
        }

        public void AddUser(string groupId, SocialUser user)
        {
            if (user == null)
            {
                return;
            }

            var chatGroup = GetChatGroup(groupId);

            if (!chatGroup.Users.Any(u => u.Email.Equals(user.Email, StringComparison.InvariantCultureIgnoreCase)))
            {
                chatGroup.Users.Add(user);
            }

            if (!chatGroup.ActiveUsersByEmail.Any(activeEmail => activeEmail.Equals(user.Email, StringComparison.InvariantCultureIgnoreCase)))
            {
                chatGroup.ActiveUsersByEmail.Add(user.Email);
            }
        }

        public void RemoveUser(string groupId, SocialUser user)
        {
            if (user == null)
            {
                return;
            }

            var chatGroup = GetChatGroup(groupId);

            if (chatGroup.ActiveUsersByEmail.Any(activeEmail => activeEmail.Equals(user.Email, StringComparison.InvariantCultureIgnoreCase)))
            {
                chatGroup.ActiveUsersByEmail.Remove(user.Email);
            }
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
            AddUser(groupId, message.User);

            // Store message
            var user = _userService.GetByEmail(message.User.Email, message.User.Provider);
            if (user == null)
            {
                _userService.AddOrUpdate(message.User);
            }

            var chatGroupEntity = _chatGroupRepository.GetAll().Where(cg => cg.GroupName.Equals(groupId, StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault();
            if (chatGroupEntity == null)
            {
                _chatGroupRepository.AddOrUpdate(new ChatGroupEntity { GroupName = groupId });
                chatGroupEntity = _chatGroupRepository.GetAll().Where(cg => cg.GroupName.Equals(groupId, StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault();
            }

            var chatMessageEntity = new ChatMessageEntity 
            {
                ChatGroupId = chatGroupEntity.Id,
                UserId = user.InternalId,
                Message = message.Message,
                DateSent = message.DateSent,
                IsHidden = message.IsHidden
            };
            _chatMessageRepository.AddOrUpdate(chatMessageEntity);
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
