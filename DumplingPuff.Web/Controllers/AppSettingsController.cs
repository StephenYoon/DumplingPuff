using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DumplingPuff.Web.Attributes;
using DumplingPuff.Web.Models.Configuration;

namespace DumplingPuff.Web.Controllers
{
    [GoogleAuthorize]
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
        public IActionResult Index()
        {
            var settings = new JsonResult(_appSettings)
            {
                StatusCode = 201
            };
            return settings;
        }
    }
}