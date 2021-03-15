using System.Collections.Generic;
using DumplingPuff.Models;

namespace DumplingPuff.Services.Interfaces
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