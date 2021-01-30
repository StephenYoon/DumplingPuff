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
    public class SignedInUserController : ControllerBase
    {
        private IHubContext<ChatHub> _hub;
        private ISignedInUserService _signedInUserService;

        public SignedInUserController(IHubContext<ChatHub> hub, ISignedInUserService userService)
        {
            _hub = hub;
            _signedInUserService = userService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var users = _signedInUserService.Get();
            return Ok(users);
        }

        [HttpGet("{email}")]
        public IActionResult GetByEmail(string email)
        {
            var user = _signedInUserService.GetByEmail(email);
            return Ok(user);
        }

        [HttpPost]
        public IActionResult Post([FromBody] SocialUser user)
        {
            var users = _signedInUserService.Get();
            if (!users.Select(u => u.Email).Any(email => email.ToLowerInvariant() == user.Email.ToLowerInvariant()))
            {
                _signedInUserService.Add(user);
            }

            _hub.Clients.All.SendAsync("broadcastSignedInUsers", users);

            return Ok(new { Message = $"POST {this.GetType().Name} Request Completed at {DateTime.Now.ToLongDateString()}" });
        }

        [HttpDelete]
        public IActionResult Delete()
        {
            _signedInUserService.Clear();
            var users = _signedInUserService.Get();
            _hub.Clients.All.SendAsync("broadcastSignedInUsers", users);

            return Ok(new { Message = $"DELETE {this.GetType().Name} Request Completed at {DateTime.Now.ToLongDateString()}" });
        }
    }
}