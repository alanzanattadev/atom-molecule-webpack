'use babel'

var webpack = require('webpack');
var ProgressPlugin = require('webpack/lib/ProgressPlugin');
var wds = require('webpack-dev-server');

process.on('disconnect', function() {process.exit(0)});

var compiler = webpack(require(process.env.WEBPACK_CONFIG_FILE_PATH));
compiler.apply(new ProgressPlugin(function(progress, msg) {
  process.send({progress: progress * 100});
}));
compiler.run(function(err, stats) {
  process.send({progress: 100});
  if (err) {
    console.log(err);
    process.send({
      error: err
    });
  }
  var statsObj = stats.toJson({errorDetails: true});
  process.send({
    status: true,
    webpackErrors: statsObj.errors || [],
    webpackWarnings: statsObj.warnings || [],
  });
  process.exit(1);
});
