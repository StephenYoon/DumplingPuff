using DumplingPuff.Web.Models.Chat;

namespace DumplingPuff.Web.Services
{
    public interface IChatService
    {
        void AddChatMessageToGroup(string chatGroupName, ChatMessage message);
        void ClearChatGroupMessages(string chatGroupName);
        ChatGroup GetChatGroup(string chatGroupName);
    }
}