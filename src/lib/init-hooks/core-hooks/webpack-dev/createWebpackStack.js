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


  const webpackDevPromise = new Promise((resolve, reject) => {

    /**
     * We cannot build the webpack middleware because
     * there is no information on the entrypoints on each endpoint.
     *
     * Let's wait until AFTER the routes are init'd, but before they are added
     * to boring.  Then we will collect all the entry points to
     * finalize the webpack config
     */
    boring.before('add-routers', function({routers}) {

      webpack_config.entry = routers.reduce((collector, router) => {
        if (!router.endpoints) return;
        router.endpoints.forEach(endpoint => {
          if (!endpoint.methods) return;
          Object.keys(endpoint.methods).forEach(method => {
            const methodObj = endpoint.methods[method];
            if (methodObj.entrypoint) {
              const entrypoints = ['@babel/polyfill'].concat(methodObj.entrypoint);
              if (config.get('boring.use_webpack_dev_server')) {
                entrypoints.unshift("webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000");
              }

              collector[pathitize(methodObj.entrypoint.join('_'))] = entrypoints;
            }
          })
        })
        return collector
      }, {});


      if (config.get('boring.use_webpack_dev_server')) {

        const webpack = require('webpack')
        const compiler = webpack(webpack_config)

        const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
          serverSideRender: true,
          publicPath: '/'
        });

        const HMRMiddleware = require('webpack-hot-middleware')(compiler);

        resolve(compose([
          webpackDevMiddleware,
          HMRMiddleware,
          function(req, res, next) {
            next();
          }
        ]));
      }
      else resolve(passthrough);
    });

  });

  return deferMiddleware(webpackDevPromise);

}