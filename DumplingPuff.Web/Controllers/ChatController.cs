using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using DumplingPuff.Web.Hubs;
using DumplingPuff.Web.Models;
using DumplingPuff.Web.Services;

namespace DumplingPuff.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private IHubContext<ChatHub> _hub;
        private IChatHistoryService _chatHistoryService;

        public ChatController(IHubContext<ChatHub> hub, IChatHistoryService chatHistoryService)
        {
            _hub = hub;
            _chatHistoryService = chatHistoryService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            //_hub.Clients.All.SendAsync("broadcastMessage", new ChatMessage { User = new SocialUser(), Message = "Hi :)" });
            return Ok(new { Message = $"GET {this.GetType().Name} Request Completed at {DateTime.Now.ToLongDateString()}" });
        }

        [HttpGet("history")]
        public IActionResult GetHistory()
        {
            var broadcastContent = _chatHistoryService.Get();
            _hub.Clients.All.SendAsync("broadcastChatHistory", broadcastContent);
            return Ok(_chatHistoryService.Get(1));
        }

        [HttpPost]
        public IActionResult Post([FromBody] ChatMessage chatMessage)
        {
            _chatHistoryService.Add(chatMessage);
            var broadcastContent = _chatHistoryService.Get();
            _hub.Clients.All.SendAsync("broadcastChatHistory", broadcastContent);

            return Ok(new { Message = $"POST {this.GetType().Name} Request Completed at {DateTime.Now.ToLongDateString()}" });
        }

        [HttpDelete]
        public IActionResult Delete(string chatRoom)
        {
            _chatHistoryService.Clear();
            var broadcastContent = _chatHistoryService.Get();
            _hub.Clients.All.SendAsync("broadcastChatHistory", broadcastContent);

            return Ok(new { Message = $"DELETE {this.GetType().Name} Completed at {DateTime.Now.ToLongDateString()}" });
        }
    }
}