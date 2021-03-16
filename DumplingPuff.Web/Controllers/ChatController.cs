using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using DumplingPuff.Web.Attributes;
using DumplingPuff.Web.Hubs;
using DumplingPuff.Models.Chat;
using DumplingPuff.Services;
using DumplingPuff.Services.Interfaces;

namespace DumplingPuff.Web.Controllers
{
    [GoogleAuthorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private IHubContext<ChatHub> _hub;
        private IChatService _chatService;

        public ChatController(IHubContext<ChatHub> hub, IChatService chatService)
        {
            _hub = hub;
            _chatService = chatService;
        }

        [HttpGet("chatgroup/{groupId}")]
        public async Task<IActionResult> GetChatGroupAsync(string groupId)
        {
            var broadcastContent = _chatService.GetChatGroup(groupId);
            await _hub.Clients.All.SendAsync("broadcastChatGroup", broadcastContent);

            return Ok(_chatService.GetChatGroup(groupId));
        }

        [HttpPost("chatgroup/{groupId}")]
        public async Task<IActionResult> PostAsync(string groupId, [FromBody] ChatMessage chatMessage)
        {
            _chatService.AddChatMessageToGroup(groupId, chatMessage);
            var broadcastContent = _chatService.GetChatGroup(groupId);
            await _hub.Clients.All.SendAsync("broadcastChatGroup", broadcastContent);

            return Ok(new { Message = $"POST {this.GetType().Name} Request Completed at {DateTime.Now.ToLongDateString()}" });
        }

        [HttpDelete("chatgroup/{groupId}")]
        public async Task<IActionResult> DeleteAsync(string groupId)
        {
            _chatService.ClearChatGroupMessages(groupId);
            var broadcastContent = _chatService.GetChatGroup(groupId);
            await _hub.Clients.All.SendAsync("broadcastChatGroup", broadcastContent);

            return Ok(new { Message = $"DELETE {this.GetType().Name} Completed at {DateTime.Now.ToLongDateString()}" });
        }
    }
}