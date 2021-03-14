using System;
using System.Collections.Generic;
using DumplingPuff.EntityModels.DumplingPuff;

namespace DumplingPuff.DataAccess.Repository.Interfaces
{
    public interface IUserRepository
    {
        IEnumerable<UserEntity> GetSocialProviderUsers(string socialProvider);
    }
}
