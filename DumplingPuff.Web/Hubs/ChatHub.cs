using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Serialization;
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

        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("Send", $"{Context.ConnectionId} has joined the group {groupName}.");
        }

        public async Task RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("Send", $"{Context.ConnectionId} has left the group {groupName}.");
        }

        public async Task SendChatMessage(string groupId, string chatMessage)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var msg = JsonSerializer.Deserialize<ChatMessage>(chatMessage, options);
            //_chatService.AddChatMessageToGroup(groupId, chatMessage);
            //var broadcastContent = _chatService.GetChatGroup(groupId);
            await Clients.All.SendAsync("test", chatMessage);
        }

        public async Task UpdateChatGroup(string groupId, ChatMessage chatMessage)
        {
            _chatService.AddChatMessageToGroup(groupId, chatMessage);
            var broadcastContent = _chatService.GetChatGroup(groupId);
            await Clients.All.SendAsync("broadcastChatGroup", broadcastContent);
        }

        public override Task OnConnectedAsync() =>
            Clients.All.SendAsync("broadcastSystemMessage", $"{Context.User.Identity.Name} JOINED");

        public Task Echo(string name, string message) =>
            Clients.Client(Context.ConnectionId)
                   .SendAsync("echo", name, $"{message} (echo from server)");
    }
}
