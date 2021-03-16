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
    public class ChatMessageRepository : Repository<ChatMessageEntity>, IChatMessageRepository
    {
        public ChatMessageRepository(IConnectionFactory connectionFactory) : base(connectionFactory)
        {
        }
    }
}
