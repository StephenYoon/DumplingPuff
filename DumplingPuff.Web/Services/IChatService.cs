using DumplingPuff.Web.Models;
using DumplingPuff.Web.Models.Chat;

namespace DumplingPuff.Web.Services
{
    public interface IChatService
    {
        void AddUserToGroup(string groupId, SocialUser user);
        void AddChatMessageToGroup(string chatGroupName, ChatMessage message);
        void ClearChatGroupMessages(string chatGroupName);
        ChatGroup GetChatGroup(string chatGroupName);
    }
}