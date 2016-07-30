'use babel'

var webpack = require('webpack');
var ProgressPlugin = require('webpack/lib/ProgressPlugin');
var wds = require('webpack-dev-server');

process.on('disconnect', function() {process.exit(0)});

var compiler = webpack(require(process.env.WEBPACK_CONFIG_FILE_PATH));
compiler.apply(new ProgressPlugin(function(progress, msg) {
  process.send({progress: progress * 100});
}));
compiler.plugin("compile", function() {
  console.log("compilation started");
  process.send({progress: 0});
});

function cb(err, stats) {
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
};

if (process.env.WEBPACK_WATCH) {
  compiler.watch({aggregateTimeout: 600}, cb);
  console.log("Webpack watch started");
} else {
  compiler.run(cb);
  console.log("Webpack build started");
}
