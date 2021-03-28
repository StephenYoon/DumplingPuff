using DumplingPuff.Models.Chat;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DumplingPuff.Models.Configuration
{
    public class AppSettings : IAppSettings
    {
        public static string EnvironmentCode => System.Environment.GetEnvironmentVariable("ENVIRONMENT") ?? "dev";
        public string Environment => EnvironmentCode;
        public string AuthenticationGoogleClientId { get; set; }
        public string AuthenticationGoogleClientSecret { get; set; }
        public string AzureAdAudience { get; set; }
        public string AzureAdAuthorityEndpoint { get; set; }
        public string AzureAdOpenIdConfigurationEndpointSuffix { get; set; }
        public string BaseApiUrl { get; set; }
        public string DefaultChatGroupId => ChatGroup.DumplingPuffMainChatGroupId;
        public string DumplingPuffDatabaseConnection { get; set; }
    }
}
