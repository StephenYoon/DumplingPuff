# DumplingPuff
Not sure what this is going to be yet, but we'll see... ¯\_(ツ)_/¯

Dev notes:

**Issue 1:** VS2019 has issues with node-gyp when using npm install 
- For example in Azure Pipelines when building this application, you may see 
  - `gyp ERR! This is a bug in node-gyp`
- Recommended fix was to specify a version node version 10.16.3 as noted here:
- https://developercommunity.visualstudio.com/content/problem/814358/errors-with-node-gyp-appearing.html 