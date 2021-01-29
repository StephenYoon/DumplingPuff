using System;
using System.Collections.Generic;
using System.Linq;
using DumplingPuff.Web.Models;

namespace DumplingPuff.Web.Services
{
    public class ChatHistoryService : IChatHistoryService
    {
        private List<ChatMessage> _chatMessages;

        public ChatHistoryService()
        {
            _chatMessages = new List<ChatMessage>();
        }

        public List<ChatMessage> Get(int lastNumberOfHours = 0)
        {
            return lastNumberOfHours > 0
                ? _chatMessages.Where(m => m.DateSent >= DateTime.Now.AddHours(-1 * lastNumberOfHours)).OrderBy(m => m.DateSent).ToList()
                : _chatMessages;
        }

        public List<ChatMessage> GetByEmail(string email)
        {
            return _chatMessages
                .Where(m => m.User.Email.Equals(email, StringComparison.InvariantCultureIgnoreCase))
                .OrderBy(m => m.DateSent)
                .ToList();
        }

        public void Add(ChatMessage message)
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
            _chatMessages.Add(message);
        }

        public void Clear()
        {
            _chatMessages.Clear();
        }
    }
}
