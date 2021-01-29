using DumplingPuff.Web.Models;
using System.Collections.Generic;

namespace DumplingPuff.Web.Services
{
    public interface IChatHistoryService
    {
        void Add(ChatMessage message);
        void Clear();
        List<ChatMessage> Get(int lastNumberOfHours = 0);
        List<ChatMessage> GetByEmail(string email);
    }
}