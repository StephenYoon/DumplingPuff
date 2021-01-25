using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DumplingPuff.Web.Models.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DumplingPuff.Web.Controllers
{
    [ApiController]
    [Route("api")]
    public class AppSettingsController : Controller
    {
        IAppSettings _appSettings;

        public AppSettingsController(IAppSettings appSettings)
        {
            _appSettings = appSettings;
        }

        // GET: AppSettings
        [HttpGet("v1/[controller]/settings")]
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