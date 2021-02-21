using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using DumplingPuff.Web.Hubs;
using DumplingPuff.Web.Models;
using DumplingPuff.Web.Services;
using DumplingPuff.Web.Attributes;
using System.Threading.Tasks;

namespace DumplingPuff.Web.Controllers
{
    [GoogleAuthorize]
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
        public async Task<IActionResult> GetAsync()
        {
            var users = await Task.Run(() => _signedInUserService.Get());
            return Ok(users);
        }

        [HttpGet("{email}")]
        public async Task<IActionResult> GetByEmailAsync(string email)
        {
            var user = await Task.Run(() => _signedInUserService.GetByEmail(email));
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] SocialUser user)
        {
            var users = _signedInUserService.Get();
            if (!users.Select(u => u.Email).Any(email => email.ToLowerInvariant() == user.Email.ToLowerInvariant()))
            {
                _signedInUserService.Add(user);
                users = _signedInUserService.Get();
            }

            await _hub.Clients.All.SendAsync("broadcastSignedInUsers", users);

            return Ok(new { Message = $"POST {this.GetType().Name} Request Completed at {DateTime.Now.ToLongDateString()}" });
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteAsync()
        {
            _signedInUserService.Clear();
            var users = _signedInUserService.Get();
            await _hub.Clients.All.SendAsync("broadcastSignedInUsers", users);

            return Ok(new { Message = $"DELETE {this.GetType().Name} Request Completed at {DateTime.Now.ToLongDateString()}" });
        }

        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteByEmailAsync(string email)
        {
            _signedInUserService.RemoveByEmail(email);
            var users = _signedInUserService.Get();
            await _hub.Clients.All.SendAsync("broadcastSignedInUsers", users);

            return Ok(new { Message = $"DELETE {this.GetType().Name} Request Completed, user removed at {DateTime.Now.ToLongDateString()}" });
        }
    }
}