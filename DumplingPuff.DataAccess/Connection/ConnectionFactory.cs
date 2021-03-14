using System;
using System.Data.SqlClient;
using DumplingPuff.Models.Configuration;

namespace DumplingPuff.DataAccess.Connection
{
    public class ConnectionFactory : IConnectionFactory
    {
        private readonly IAppSettings _appSettings;

        public ConnectionFactory(IAppSettings settings)
        {
            _appSettings = settings;
        }

        public SqlConnection CreateDumplingPuffConnection()
        {
            var connectionBuilder = new SqlConnectionStringBuilder(_appSettings.DumplingPuffDatabaseConnection);
            return new SqlConnection(connectionBuilder.ToString());
        }
    }
}