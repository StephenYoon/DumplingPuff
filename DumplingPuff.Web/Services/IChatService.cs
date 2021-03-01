using System.Collections.Generic;
using DumplingPuff.Web.Models;
using DumplingPuff.Web.Models.Chat;

namespace DumplingPuff.Web.Services
{
    public interface IChatService
    {
        List<ChatGroup> GetChatGroups();
        ChatGroup GetChatGroup(string chatGroupName);
        void AddUser(string groupId, SocialUser user);
        void RemoveUser(string groupId, SocialUser user);
        void AddChatMessageToGroup(string chatGroupName, ChatMessage message);
        void ClearChatGroupMessages(string chatGroupName);
    }
}