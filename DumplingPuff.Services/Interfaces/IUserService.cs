using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DumplingPuff.Models;

namespace DumplingPuff.Services.Interfaces
{
    public interface IUserService
    {
        SocialUser GetByEmail(string email, string provider);
        void AddOrUpdate(SocialUser user);
    }
}
