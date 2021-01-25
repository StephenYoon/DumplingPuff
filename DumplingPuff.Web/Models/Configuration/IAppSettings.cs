namespace DumplingPuff.Web.Models.Configuration
{
    public interface IAppSettings
    {
        string Environment { get; }
        string AuthenticationGoogleClientId { get; set; }
        string AuthenticationGoogleClientSecret { get; set; }
    }
}