using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DumplingPuff.Models;

namespace DumplingPuff.Services.Interfaces
{
    public interface IUserService
    {
        void AddOrUpdate(SocialUser user);
    }
}
