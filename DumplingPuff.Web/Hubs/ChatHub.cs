using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace DumplingPuff.Web.Hubs
{
    public class ChatHub : Hub
    {
        //public async Task BroadcastChartData(string data) => await Clients.All.SendAsync("broadcastMessage", data);

        public Task BroadcastMessage(string name, string message) =>
            Clients.All.SendAsync("broadcastMessage", name, message);

        public Task Echo(string name, string message) =>
            Clients.Client(Context.ConnectionId)
                   .SendAsync("echo", name, $"{message} (echo from server)");
    }
}
