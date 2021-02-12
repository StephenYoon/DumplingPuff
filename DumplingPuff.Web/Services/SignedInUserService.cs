using System;
using System.Collections.Generic;
using System.Linq;
using DumplingPuff.Web.Models;

namespace DumplingPuff.Web.Services
{
    public class SignedInUserService : ISignedInUserService
    {
        private List<SocialUser> _socialUsers;

        public SignedInUserService()
        {
            _socialUsers = new List<SocialUser>();
        }

        public List<SocialUser> Get()
        {
            return _socialUsers;
        }

        public SocialUser GetByEmail(string email)
        {
            return _socialUsers.FirstOrDefault(m => m.Email.Equals(email, StringComparison.InvariantCultureIgnoreCase));
        }

        public void Add(SocialUser user)
        {
            if (user != null)
            {
                _socialUsers.Add(user);
            }
        }

        public void RemoveByEmail(string email)
        {
            if (!string.IsNullOrEmpty(email))
            {
                _socialUsers.RemoveAll(u => u.Email.Equals(email, StringComparison.InvariantCultureIgnoreCase));
            }
        }

        public void Clear()
        {
            _socialUsers.Clear();
        }
    }
}
