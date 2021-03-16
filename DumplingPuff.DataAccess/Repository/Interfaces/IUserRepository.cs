using System;
using System.Collections.Generic;
using DumplingPuff.EntityModels.DumplingPuff;

namespace DumplingPuff.DataAccess.Repository.Interfaces
{
    public interface IUserRepository : IRepository<UserEntity>
    {
        IEnumerable<UserEntity> GetSocialProviderUsers(string socialProvider);
    }
}
