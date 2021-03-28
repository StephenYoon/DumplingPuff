using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DumplingPuff.Web.Attributes;
using DumplingPuff.Models.Configuration;

namespace DumplingPuff.Web.Controllers
{
    [CustomAuthorize]//CustomAuthorize, GoogleAuthorize
    [ApiController]
    [Route("api/[controller]")]
    public class AppSettingsController : Controller
    {
        IAppSettings _appSettings;

        public AppSettingsController(IAppSettings appSettings)
        {
            _appSettings = appSettings;
        }

        // GET: AppSettings
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var settings = await Task.Run(() => new JsonResult(_appSettings) { StatusCode = 201 });
            return settings;
        }
    }
}