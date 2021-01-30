using System.Collections.Generic;
using DumplingPuff.Web.Models;

namespace DumplingPuff.Web.Services
{
    public interface ISignedInUserService
    {
        void Add(SocialUser user);
        void Clear();
        List<SocialUser> Get();
        SocialUser GetByEmail(string email);
    }
}