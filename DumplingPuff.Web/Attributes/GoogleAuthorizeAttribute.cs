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
                var authProvider = headers["AuthorizationProvider"].ToString();

                // Verify authorization header starts with bearer and has a token
                if (!authHeader.StartsWith("Bearer ") && authHeader.Length > 7)
                {
                    context.Result = new ForbidResult();
                }

                if (authHeader.Equals("google", StringComparison.InvariantCultureIgnoreCase))
                {
                    // Grab the token and verify through google. If verification fails, and exception will be thrown.
                    var token = authHeader.Remove(0, 7);
                    var validated = GoogleJsonWebSignature.ValidateAsync(token, new GoogleJsonWebSignature.ValidationSettings()).Result;
                }

                if (authHeader.Equals("microsoft", StringComparison.InvariantCultureIgnoreCase))
                {
                    // Grab the token and verify. If verification fails, and exception will be thrown.
                    var token = authHeader.Remove(0, 7);
                    var validated = token.Length > 0 ? true : false; // TODO: we'll come up with something better
                }
            }
            catch (Exception ex)
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
