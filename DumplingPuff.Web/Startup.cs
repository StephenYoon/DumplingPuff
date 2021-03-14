using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using DumplingPuff.Models.Configuration;
using DumplingPuff.Web.Hubs;
using DumplingPuff.Web.Services;

namespace DumplingPuff.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // App settings
            var settings = Configuration.Get<AppSettings>();
            settings.AuthenticationGoogleClientId = Configuration.GetValue<string>("Authentication:Google:ClientId");
            settings.BaseApiUrl = Configuration.GetValue<string>("BaseApiUrl");
            services.AddSingleton<IAppSettings>(t => settings);

            // Services
            services.AddSingleton<IChatService, ChatService>();
            services.AddSingleton<ISignedInUserService, SignedInUserService>();

            /*
             * By not passing a parameter to AddAzureSignalR(), this code uses the default configuration key 
             * for the SignalR Service resource connection string. 
             * The default configuration key is Azure:SignalR:ConnectionString.
             */
            services.AddSignalR().AddAzureSignalR();

            // CORS
            //services.AddCors(options =>
            //{
            //    options.AddPolicy("CorsPolicy", builder => builder
            //    .WithOrigins("https://localhost:5001", "https://dumplingpuff.azurewebsites.net", "https://dumplingpuff-dev.azurewebsites.net")
            //    .AllowAnyMethod()
            //    .AllowAnyHeader()
            //    .AllowCredentials());
            //});

            //services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
            //{
            //    builder.AllowAnyOrigin()
            //           .AllowAnyMethod()
            //           .AllowAnyHeader();
            //}));

            services.AddCors(options => options.AddPolicy("CorsPolicy",
                builder =>
                {
                    builder.WithOrigins(
                        "https://localhost:5001"
                        , "https://*dumplingpuff.azurewebsites.net*"
                        , "https://dumplingpuff.azurewebsites.net"
                        , "https://*dumplingpuff-dev.azurewebsites.net*"
                        , "https://dumplingpuff-dev.azurewebsites.net")
                        .SetIsOriginAllowedToAllowWildcardSubdomains()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                }));

            services.AddControllersWithViews();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors("CorsPolicy");
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();
            app.UseFileServer();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<ChatHub>("/chat");
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
