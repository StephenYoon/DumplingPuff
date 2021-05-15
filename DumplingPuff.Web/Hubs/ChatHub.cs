using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.SignalR;
using DumplingPuff.Models.Chat;
using DumplingPuff.Services;
using DumplingPuff.Services.Interfaces;
using DumplingPuff.Models;
using Google.Apis.Auth.OAuth2;

namespace DumplingPuff.Web.Hubs
{
    public class ChatHub : Hub
    {
        private IChatService _chatService;
        private IUserService _userService;

        public ChatHub(IChatService chatService, IUserService userService)
        {
            _chatService = chatService;
            _userService = userService;
        }

        public async Task UpdateGroup(string groupId, string messageDto)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var message = JsonSerializer.Deserialize<ChatMessage>(messageDto, options);

            _chatService.AddChatMessageToGroup(groupId, message);
            var broadcastContent = _chatService.GetGroup(groupId);
            await Clients.Group(groupId).SendAsync("broadcastGroup", broadcastContent);
            await Clients.Group(groupId).SendAsync("notification", $"ChatHub Notification: {message.User.Email} ({Context.ConnectionId}) updated group {groupId}.");
        }

        public async Task UserJoinedGroup(string groupId, string userDto)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var user = JsonSerializer.Deserialize<SocialUser>(userDto, options);

            // Remove user from other chats to avoid getting unnecessary updates
            var groups = _chatService.GetGroups();
            foreach (var group in groups)
            {
                if (!group.Id.Equals(groupId, StringComparison.InvariantCultureIgnoreCase))
                {
                    await UserLeftGroup(group.Id, userDto);
                }
            }

            // Add user to chat
            _chatService.AddUser(groupId, user);
            var broadcastContent = _chatService.GetGroup(groupId);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupId);
            await Clients.Group(groupId).SendAsync("broadcastGroup", broadcastContent);
            await Clients.Group(groupId).SendAsync("notification", $"ChatHub Notification: {user.Email} ({Context.ConnectionId}) joined group {groupId}.");

            // Update user
            _userService.AddOrUpdate(user);
        }

        public async Task UserReconnected(string groupId, string userDto)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var user = JsonSerializer.Deserialize<SocialUser>(userDto, options);

            _chatService.AddUser(groupId, user);
            var broadcastContent = _chatService.GetGroup(groupId);
            await Clients.Group(groupId).SendAsync("broadcastGroup", broadcastContent);
            await Clients.Group(groupId).SendAsync("notification", $"ChatHub Notification: {user.Email} ({Context.ConnectionId}) reconnected to group {groupId}.");
        }

        public async Task UserLeftGroup(string groupId, string userDto)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var user = JsonSerializer.Deserialize<SocialUser>(userDto, options);

            _chatService.RemoveUser(groupId, user);
            var broadcastContent = _chatService.GetGroup(groupId);

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId);
            await Clients.Group(groupId).SendAsync("notification", $"ChatHub Notification: {user.Email} ({Context.ConnectionId}) left group {groupId}.");
            await Clients.Group(groupId).SendAsync("broadcastGroup", broadcastContent);
        }

        public override Task OnConnectedAsync() =>
            Clients.All.SendAsync("broadcastSystemMessage", $"{Context.User.Identity.Name} JOINED");

        public Task Echo(string name, string message) =>
            Clients.Client(Context.ConnectionId)
                   .SendAsync("echo", name, $"{message} (echo from server)");

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
    }
}
