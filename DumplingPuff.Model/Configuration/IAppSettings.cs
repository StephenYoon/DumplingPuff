namespace DumplingPuff.Models.Configuration
{
    public interface IAppSettings
    {
        string Environment { get; }
        string AuthenticationGoogleClientId { get; set; }
        string AuthenticationGoogleClientSecret { get; set; }
        string DefaultChatGroupId { get; }
        string DumplingPuffDatabaseConnection { get; set; }
    }
}