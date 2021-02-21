using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using DumplingPuff.Web.Models.Chat;
using DumplingPuff.Web.Services;

namespace DumplingPuff.Web.Hubs
{
    public class ChatHub : Hub
    {
        private IChatService _chatService;

        public ChatHub(IChatService chatService)
        {
            _chatService = chatService;
        }

        public override Task OnConnectedAsync() => 
            Clients.All.SendAsync("broadcastSystemMessage", $"{Context.User.Identity.Name} JOINED");

        public Task UpdateChatGroup(string groupId, ChatMessage chatMessage)
        {
            _chatService.AddChatMessageToGroup(groupId, chatMessage);
            var broadcastContent = _chatService.GetChatGroup(groupId);
            return Clients.All.SendAsync("broadcastChatGroup", broadcastContent);
        }

        public Task Echo(string name, string message) =>
            Clients.Client(Context.ConnectionId)
                   .SendAsync("echo", name, $"{message} (echo from server)");
    }
}
