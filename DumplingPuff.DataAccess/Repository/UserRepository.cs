using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using DumplingPuff.DataAccess.Connection;
using DumplingPuff.DataAccess.Repository.Interfaces;
using DumplingPuff.EntityModels.DumplingPuff;
using Dapper;
using Dapper.FastCrud;

namespace DumplingPuff.DataAccess.Repository
{
    public class UserRepository : Repository<UserEntity>, IUserRepository
    {
        public UserRepository(IConnectionFactory connectionFactory) : base(connectionFactory)
        {
        }

        public IEnumerable<UserEntity> GetSocialProviderUsers(string socialProvider)
        {
            var results = Database.Query<UserEntity>(
                "dbo.GetSocialProviderUsers",
                new { socialProvider = socialProvider },
                commandType: CommandType.StoredProcedure);

            return results.ToList();
        }

        public IEnumerable<UserEntity> GetUser(string email)
        {
            var results = Database.Find<UserEntity>(statement => statement.Where($@"{nameof(UserEntity.Email):C} = {email}"));
            return results;
        }
    }
}
