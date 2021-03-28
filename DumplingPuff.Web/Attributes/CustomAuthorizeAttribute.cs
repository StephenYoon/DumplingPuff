using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Google.Apis.Auth;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Protocols;
using System.Threading;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using DumplingPuff.Models.Configuration;

namespace DumplingPuff.Web.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class CustomAuthorizeAttribute : TypeFilterAttribute
    {
        public CustomAuthorizeAttribute() : base(typeof(CustomAuthorizeFilter)) { }
    }

    public class CustomAuthorizeFilter : /*AuthorizeAttribute,*/ IAuthorizationFilter
    {
        IAppSettings _appSettings;

        public CustomAuthorizeFilter(IAppSettings appSettings)
        {
            _appSettings = appSettings;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                /*
                var user = context.HttpContext.User;
                if (!user.Identity.IsAuthenticated)
                {
                    // it isn't needed to set unauthorized result 
                    // as the base class already requires the user to be authenticated
                    // this also makes redirect to a login page work properly
                    // context.Result = new UnauthorizedResult();
                    return;
                }
                */

                // Verify Authorization header exists
                var headers = context.HttpContext.Request.Headers;
                if (!headers.ContainsKey("Authorization"))
                {
                    context.Result = new ForbidResult();
                }
                var authHeader = headers["Authorization"].ToString();
                var authProvider = headers["AuthorizationProvider"].ToString();

                // Verify authorization header starts with bearer and has a token
                if (!authHeader.StartsWith("Bearer ") && authHeader.Length > 7)
                {
                    context.Result = new ForbidResult();
                }

                if (authProvider.Equals("google", StringComparison.InvariantCultureIgnoreCase))
                {
                    // Grab the token and verify through google. If verification fails, and exception will be thrown.
                    var token = authHeader.Remove(0, 7);
                    var validated = GoogleJsonWebSignature.ValidateAsync(token, new GoogleJsonWebSignature.ValidationSettings()).Result;
                }
                else if (authProvider.Equals("microsoft", StringComparison.InvariantCultureIgnoreCase))
                {
                    // Grab the token and verify. If verification fails, and exception will be thrown.
                    var token = authHeader.Remove(0, 7);
                    var validated = token.Length > 0 ? true : false; // TODO: we'll come up with something better

                    // TODO: figure out a better-er way to validate idToken from Microsoft MSAL
                    var openIdConfigurationEndpoint = $"{_appSettings.AzureAdAuthorityEndpoint}{_appSettings.AzureAdOpenIdConfigurationEndpointSuffix}";
                    IConfigurationManager<OpenIdConnectConfiguration> configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(openIdConfigurationEndpoint, new OpenIdConnectConfigurationRetriever());
                    OpenIdConnectConfiguration openIdConfig = configurationManager.GetConfigurationAsync(CancellationToken.None).Result;

                    TokenValidationParameters validationParameters = new TokenValidationParameters
                    {
                        ValidIssuer = "https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0",
                        ValidAudiences = new[] { _appSettings.AzureAdAudience },
                        ValidateAudience = true,
                        ValidateIssuerSigningKey = false,
                        ValidateIssuer = false,
                        IssuerSigningKeys = openIdConfig.SigningKeys
                    };

                    SecurityToken validatedToken;
                    JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
                    var tokenUser = handler.ValidateToken(token, validationParameters, out validatedToken);
                }
                else
                {
                    context.Result = new ForbidResult();
                }
            }
            catch (Exception ex)
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
