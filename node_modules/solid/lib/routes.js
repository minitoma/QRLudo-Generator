(function() {
  var Path, Router, dsl, methods;
  var __slice = Array.prototype.slice;

  dsl = require('./dsl');

  Path = require('path');

  methods = {
    'get': [],
    'post': ['create'],
    'put': ['update'],
    'delete': ['del']
  };

  Router = (function() {
    var alias, aliases, method, _fn, _i, _len;
    var _this = this;

    function Router(app) {
      this.app = app;
      this.routes = {};
      this.namespaces = [];
    }

    Router.prototype.namespace = function(path, fn) {
      this.namespaces.push(path);
      fn.call(dsl);
      this.namespaces.pop();
      return this;
    };

    for (method in methods) {
      aliases = methods[method];
      aliases.push(method);
      _fn = function(method) {
        return Router.prototype[alias] = function(path, action) {
          var fullPath;
          fullPath = Path.join.apply(Path, ['/'].concat(__slice.call(this.namespaces), [path]));
          return this.app[method](fullPath, function(req, res, next) {
            var content, _ref;
            res.setHeader('X-Powered-By', 'solid');
            console.log("[" + req.method + "] " + req.path);
            if (typeof action === "function") {
              content = action.call(dsl, req, res);
            } else if (typeof action === "string" && action[0] === '/') {
              res.redirect(action);
              return;
            }
            if (!content) return;
            if (typeof content === "object") {
              if ((_ref = content.headers) == null) content.headers = {};
              if ("type" in content) {
                content.headers['Content-Type'] = content.type;
              }
              res.writeHead(content.statusCode || 200, content.headers);
              return res.end(content.body, 'utf-8');
            } else {
              res.writeHead(200, {
                'Content-Type': 'text/html'
              });
              return res.end(content, 'utf-8');
            }
          });
        };
      };
      for (_i = 0, _len = aliases.length; _i < _len; _i++) {
        alias = aliases[_i];
        _fn(method);
      }
    }

    return Router;

  }).call(this);

  module.exports = {
    Router: Router
  };

}).call(this);
