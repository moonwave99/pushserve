var express = require('express');
var http = require('http');
var sysPath = require('path');

var startServer = function(options, callback) {
  // Specify default options.
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  if (options == null) options = {};
  if (options.path == null) options.path = '.';
  if (options.port == null) options.port = 8000;
  if (options.base == null) options.base = '';
  if (options.indexPath == null) options.indexPath = sysPath.join(options.path, 'index.html')
  if (options.noCors == null) options.noCors = false;
  if (options.noPushState == null) options.noPushState = false;
  if (callback == null) callback = Function.prototype;

  var app = express();

  // Send cross-origin resource sharing enabling header.
  if (!options.noCors) {
    app.use(function(request, response, next) {
      response.header('Cache-Control', 'no-cache');
      response.header('Access-Control-Allow-Origin', '*');
      next();
    });
  }

  // Route all static files to http paths.
  app.use(options.base, express.static(options.path));

  // Route all non-existent files to `index.html`
  if (!options.noPushState) {
    app.all('' + options.base + '/*', function(request, response) {
      response.sendfile(options.indexPath);
    });
  }

  // Wrap express app with node.js server in order to have stuff like server.stop() etc.
  var server = http.createServer(app);
  server.listen(options.port, function(error) {
    console.log('Serving HTTP on 0.0.0.0 port', options.port);
    callback(error, options);
  });
  return server;
};

module.exports = startServer;