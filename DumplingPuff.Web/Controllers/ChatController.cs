using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using DumplingPuff.Web.Hubs;

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

        public IActionResult Get()
        {
            _hub.Clients.All.SendAsync("broadcastMessage", "Test data from api controller.");
            return Ok(new { Message = "Request Completed" });
        }
    }
}