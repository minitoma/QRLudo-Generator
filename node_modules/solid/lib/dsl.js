(function() {
  var compiled, dsl, fs, includes, normalize, path, readFile, render, thermos;

  fs = require('fs');

  thermos = require('thermos');

  path = require('path');

  dsl = module.exports = {};

  includes = {};

  compiled = {};

  dsl.render = function(opts, func) {
    if (!func) {
      func = opts;
      opts = {};
    }
    return function(req, res) {
      opts.locals = req || {};
      return thermos.render(opts, func);
    };
  };

  dsl.jquery = function() {
    return {
      type: 'text/javascript',
      body: fs.readFileSync("" + __dirname + "/../external-libs/jquery.min.js", 'utf8')
    };
  };

  dsl.haml = function(template, options, locals) {
    if (options == null) options = {};
    if (locals == null) locals = {};
    return render('haml', template, options, locals);
  };

  dsl.jade = function(template, options, locals) {
    if (options == null) options = {};
    if (locals == null) locals = {};
    options.method || (options.method = 'compile');
    return render('jade', template, options, locals);
  };

  dsl.sass = function(template, options, locals) {
    if (options == null) options = {};
    if (locals == null) locals = {};
    options.method || (options.method = 'render');
    return render('sass', template, options);
  };

  render = function(engine, template, options, locals) {
    var contents, extension, method, renderer, views, _ref;
    extension = options.extension || engine;
    views = options.views || 'views';
    method = options.method;
    template = normalize(template, extension);
    if (!(template in compiled)) {
      if ((_ref = includes[engine]) == null) includes[engine] = require(engine);
      contents = readFile(template, views);
      renderer = method != null ? includes[engine][method] : includes[engine];
      compiled[template] = renderer(contents);
    }
    if (locals != null) {
      return compiled[template](locals);
    } else {
      return compiled[template];
    }
  };

  normalize = function(url, extension) {
    var urlExtension;
    urlExtension = url.split('.').pop();
    if (extension === urlExtension) {
      return url;
    } else {
      return "" + url + "." + extension;
    }
  };

  readFile = function(filePath, views) {
    var fullPath;
    filePath = filePath.replace(/^\/\/*/, '');
    fullPath = path.join(process.cwd(), views, filePath);
    return fs.readFileSync(fullPath, 'utf8');
  };

}).call(this);
