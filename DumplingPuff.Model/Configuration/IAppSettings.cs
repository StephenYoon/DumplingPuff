namespace DumplingPuff.Models.Configuration
{
    public interface IAppSettings
    {
        string Environment { get; }
        string AuthenticationGoogleClientId { get; set; }
        string AuthenticationGoogleClientSecret { get; set; }
        string AzureAdAudience { get; set; }
        string AzureAdAuthorityEndpoint { get; set; }
        string AzureAdOpenIdConfigurationEndpointSuffix { get; set; }
        string DefaultChatGroupId { get; }
        string DumplingPuffDatabaseConnection { get; set; }
    }
}