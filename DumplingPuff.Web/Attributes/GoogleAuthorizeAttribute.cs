using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Google.Apis.Auth;

namespace DumplingPuff.Web.Attributes
{
    /// <summary>
    /// Custom Google Authentication authorize attribute which validates the bearer token.
    /// </summary>
    public class GoogleAuthorizeAttribute : TypeFilterAttribute
    {
        public GoogleAuthorizeAttribute() : base(typeof(GoogleAuthorizeFilter)) { }
    }


    public class GoogleAuthorizeFilter : IAuthorizationFilter
    {

        public GoogleAuthorizeFilter()
        {
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                // Verify Authorization header exists
                var headers = context.HttpContext.Request.Headers;
                if (!headers.ContainsKey("Authorization"))
                {
                    context.Result = new ForbidResult();
                }
                var authHeader = headers["Authorization"].ToString();

                // Verify authorization header starts with bearer and has a token
                if (!authHeader.StartsWith("Bearer ") && authHeader.Length > 7)
                {
                    context.Result = new ForbidResult();
                }

                // Grab the token and verify through google. If verification fails, and exception will be thrown.
                var token = authHeader.Remove(0, 7);
                var validated = GoogleJsonWebSignature.ValidateAsync(token, new GoogleJsonWebSignature.ValidationSettings()).Result;

                //var validated = GoogleJsonWebSignature.ValidateAsync(token, new GoogleJsonWebSignature.ValidationSettings()
                //{
                //    /*
                //     This application is used only for our Google G Suite users, and thus the “HostedDomain” option of the ValidationSettings is set. 
                //     This isn’t necessary, and I believe can just be removed if you allow any Google user to authenticate.
                //     */
                //    HostedDomain = "dumplingpuff-dev.azurewebsites.net",
                //}).Result;
            }
            catch (Exception ex)
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
