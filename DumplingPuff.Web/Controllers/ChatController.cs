using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using DumplingPuff.Web.Hubs;
using DumplingPuff.Web.Models;

namespace DumplingPuff.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private IHubContext<ChatHub> _hub;

        public ChatController(IHubContext<ChatHub> hub)
        {
            _hub = hub;
        }

        [HttpGet]
        public IActionResult Get()
        {
            //_hub.Clients.All.SendAsync("broadcastMessage", new ChatMessage { User = new SocialUser(), Message = "Hi :)" });
            return Ok(new { Message = "Request Completed" });
        }

        [HttpPost]
        public IActionResult Post([FromBody] ChatMessage chatMessage)
        {
            _hub.Clients.All.SendAsync("broadcastMessage", chatMessage);
            return Ok(new { Message = "Request Completed" });
        }
    }
}