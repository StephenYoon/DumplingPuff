using System.Collections.Generic;
using DumplingPuff.Models;

namespace DumplingPuff.Web.Services
{
    public interface ISignedInUserService
    {
        void Add(SocialUser user);
        void Clear();
        List<SocialUser> Get();
        SocialUser GetByEmail(string email);
        void RemoveByEmail(string email);
    }
}