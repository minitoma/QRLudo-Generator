(function() {
  var DEFAULT_PORT, Router, createServer, dsl, express, port, solid;

  dsl = require('./dsl');

  Router = require('./routes').Router;

  express = require('express');

  DEFAULT_PORT = 8081;

  port = process.env.PORT || DEFAULT_PORT;

  solid = module.exports = function(options, func) {
    var server, _ref;
    if (!func) {
      func = options;
      options = {};
    }
    if ((_ref = options.port) == null) options.port = port;
    server = createServer(options);
    func.call(dsl, new Router(server));
    server.listen(options.port, options.host, options.callback);
    console.log("Solidified port " + options.port);
    return server;
  };

  createServer = function(options) {
    var app, staticDir;
    app = express.createServer();
    if ('cwd' in options) {
      staticDir = "" + options.cwd + "/static";
      console.log("Serving static files from " + staticDir);
      app.use('/static', express.static(staticDir, {
        maxAge: 0
      }));
    }
    return app;
  };

  solid.routes = require('./routes');

  solid.createServer = createServer;

  solid.DEFAULT_PORT = DEFAULT_PORT;

}).call(this);
