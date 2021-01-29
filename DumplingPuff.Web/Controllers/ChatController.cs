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
        private List<ChatMessage> _chatMessages;
        private IChatHistoryService _chatHistoryService;

        public ChatController(IHubContext<ChatHub> hub, IChatHistoryService chatHistoryService)
        {
            _hub = hub;
            _chatMessages = new List<ChatMessage>();
            _chatHistoryService = chatHistoryService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            //_hub.Clients.All.SendAsync("broadcastMessage", new ChatMessage { User = new SocialUser(), Message = "Hi :)" });
            return Ok(new { Message = $"GET Request Completed at {DateTime.Now.ToLongDateString()}" });
        }

        [HttpGet("history")]
        public IActionResult GetHistory()
        {
            return Ok(_chatHistoryService.Get(1));
        }

        [HttpPost]
        public IActionResult Post([FromBody] ChatMessage chatMessage)
        {
            _hub.Clients.All.SendAsync("broadcastChatMessage", chatMessage);

            _chatHistoryService.Add(chatMessage);
            var broadcastContent = _chatHistoryService.Get();
            _hub.Clients.All.SendAsync("broadcastChatHistory", broadcastContent);

            return Ok(new { Message = "POST Request Completed at {DateTime.Now.ToLongDateString()}" });
        }

        [HttpDelete]
        public IActionResult Delete()
        {
            _chatHistoryService.Clear();
            var broadcastContent = _chatHistoryService.Get();
            _hub.Clients.All.SendAsync("broadcastChatHistory", broadcastContent);

            return Ok(new { Message = "DELETE Request Completed at {DateTime.Now.ToLongDateString()}" });
        }
    }
}