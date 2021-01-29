using System;
using System.Collections.Generic;
using System.Linq;

namespace DumplingPuff.Web.Models
{
    public class ChatMessage
    {
        public SocialUser User { get; set; }
        public string Message { get; set; }
        public DateTime DateSent { get; set; }
    }
}
