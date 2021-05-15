using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using DumplingPuff.Services.Interfaces;
using DumplingPuff.Models;
using DumplingPuff.Models.WaruSkiesGame;

namespace DumplingPuff.Web.Hubs
{
    public class WaruSkiesGameHub : Hub
    {
        private IWaruSkiesGameService _gameService;
        private IUserService _userService;

        public WaruSkiesGameHub(IWaruSkiesGameService gameService, IUserService userService)
        {
            _gameService = gameService;
            _userService = userService;
        }

        public async Task SendMessage(string groupId, string messageDto)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var message = JsonSerializer.Deserialize<GameState>(messageDto, options);

            _gameService.UpdateGameState(groupId, message);
            var broadcastContent = _gameService.GetGroup(groupId);
            await Clients.Group(groupId).SendAsync("broadcastGroup", broadcastContent);
            await Clients.Group(groupId).SendAsync("notification", $"WaruSkiesGameHub Notification: {message.User.Email} ({Context.ConnectionId}) sent message to group {groupId}.");
        }

        public async Task UpdateGroup(string groupId, string messageDto)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var message = JsonSerializer.Deserialize<GameState>(messageDto, options);

            _gameService.UpdateGameState(groupId, message);
            var broadcastContent = _gameService.GetGroup(groupId);
            await Clients.Group(groupId).SendAsync("broadcastGroup", broadcastContent);
            await Clients.Group(groupId).SendAsync("notification", $"WaruSkiesGameHub Notification: {message.User.Email} ({Context.ConnectionId}) updated group {groupId}.");
        }

        public async Task UserJoinedGroup(string groupId, string userDto)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var user = JsonSerializer.Deserialize<SocialUser>(userDto, options);

            // Remove user from other chats to avoid getting unnecessary updates
            var groups = _gameService.GetGroups();
            foreach (var group in groups)
            {
                if (!group.Id.Equals(groupId, StringComparison.InvariantCultureIgnoreCase))
                {
                    await UserLeftGroup(group.Id, userDto);
                }
            }

            // Add user to chat
            _gameService.AddUser(groupId, user);
            var broadcastContent = _gameService.GetGroup(groupId);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupId);
            await Clients.Group(groupId).SendAsync("broadcastGroup", broadcastContent);
            await Clients.Group(groupId).SendAsync("notification", $"WaruSkiesGameHub Notification: {user.Email} ({Context.ConnectionId}) joined group {groupId}.");

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

            _gameService.AddUser(groupId, user);
            var broadcastContent = _gameService.GetGroup(groupId);
            await Clients.Group(groupId).SendAsync("broadcastGroup", broadcastContent);
            await Clients.Group(groupId).SendAsync("notification", $"WaruSkiesGameHub Notification: {user.Email} ({Context.ConnectionId}) reconnected to group {groupId}.");
        }

        public async Task UserLeftGroup(string groupId, string userDto)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var user = JsonSerializer.Deserialize<SocialUser>(userDto, options);

            _gameService.RemoveUser(groupId, user);
            var broadcastContent = _gameService.GetGroup(groupId);

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId);
            await Clients.Group(groupId).SendAsync("notification", $"WaruSkiesGameHub Notification: {user.Email} ({Context.ConnectionId}) left group {groupId}.");
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
