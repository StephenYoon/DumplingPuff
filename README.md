# DumplingPuff
Starting out with a ChatApp to get a better understanding of what I will need to build out a simple turn-based game.

## Fancy technologies under consideration:
- ASP.NET Core and C# for cross-platform server-side code
- Azure Cloud Services for building and deploying our application
  - SignalR
  - SQL Server
- Angular and TypeScript for client-side code
- Google Sign-In for user authentication
- Bootstrap for layout and styling

Dev notes:

**Issue 1:** VS2019 has issues with node-gyp when using npm install 
- For example in Azure Pipelines when building this application, you may see 
  - `gyp ERR! This is a bug in node-gyp`
- Recommended fix was to specify a version node version 10.16.3 as noted here:
- https://developercommunity.visualstudio.com/content/problem/814358/errors-with-node-gyp-appearing.html 
