using System;
using System.Data.SqlClient;

namespace DumplingPuff.DataAccess.Connection
{
    public interface IConnectionFactory
    {
        SqlConnection CreateDumplingPuffConnection();
    }
}