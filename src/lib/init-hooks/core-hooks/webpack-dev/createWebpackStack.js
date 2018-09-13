const compose = require('compose-middleware').compose
const config = require('boring-config');
const logger = require('boring-logger');
const pathitize = require('./pathitize');

function passthrough(req, res, next) { next() }

function deferMiddleware(middlewarePromise) {

  let queuing = true;
  return function proxyMiddleware(req, res, next) {
    if (queuing) logger.info('Webpack has not finished loading, queuing ' + req.url);
    middlewarePromise.then(deferedMiddleware => {
      queuing = false;
      deferedMiddleware(req, res, next);
    });
  }
}

module.exports = function createWebpackStack(BoringInjections) {

  const {
    boring,
    webpack_config
  } = BoringInjections;

  
  if (config.get('use_webpack_dev_server', false)) {

    const webpackDevPromise = new Promise((resolve, reject) => {

      const entry_points = []
      boring.on('decorator.endpoint.client', function({entry_point}) {
        entry_points.push(entry_point);
      })

      boring.after('init-endpoints', function(endpoints) {

        webpack_config.entry = entry_points.reduce((prev, entry) => {
          prev[pathitize(entry)] = [
            "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
            entry
          ];
          return prev;
        }, {});

        const webpack = require('webpack')
        const compiler = webpack(webpack_config)

        const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
          serverSideRender: true, 
          publicPath: '/' 
        });
    
        const HMRMiddleware = require('webpack-hot-middleware')(compiler);

        resolve(compose([
          webpackDevMiddleware,
          HMRMiddleware
        ]));
      });
  
    });
    
    return deferMiddleware(webpackDevPromise);
  }
  else {
    //resolve an empty middleware 
    return passthrough;
  }

}