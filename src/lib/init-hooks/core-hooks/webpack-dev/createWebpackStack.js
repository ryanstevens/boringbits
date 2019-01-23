const compose = require('compose-middleware').compose;
const config = require('boring-config');
const logger = require('boring-logger');
const pathitize = require('./pathitize');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const nodenopack = require('nodenopack');
const fs = require('fs-extra');

if (!config.get('boring.useWebpackDevServer')) {
  const statsJsonPath = process.cwd() + '/dist/webpackStats.json';
  let stats = {
    modules: [],
  };
  if (fs.existsSync(statsJsonPath)) stats = require(statsJsonPath);
  nodenopack.registerWebpackStats(stats);
}


function deferMiddleware(middlewarePromise) {
  let queuing = true;
  return function proxyMiddleware(req, res, next) {
    if (queuing) logger.info('Webpack has not finished loading, queuing ' + req.url);
    middlewarePromise.then(deferedMiddleware => {
      queuing = false;
      deferedMiddleware(req, res, next);
    });
  };
}

module.exports = function createWebpackStack(BoringInjections) {
  const {
    boring,
    // eslint-disable-next-line camelcase
    webpack_config,
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
              /**
               * So an entrypoint can be a single string, object, or an array.
               * Ultimately we want to make sure we work on an array so the
               * first thing to do is to make a single item array if it's an string or object.
               *
               * Each item in the array can either be a string or object.
               * A string implies both the path and canonical name are the same.
               * If a programmer wanted to point to path / file, but name the
               * canonical entrypoint something different then they will use an object
               * of this structure
               * {
               *    // canonicalPath will define the URL in the browsers
               *    name: 'amazing_client',
               *    // This is the path we use to require the entrypoint into the bundle
               *    assetPath: 'client/pagse/meow/mycustom_entrypoint'
               * }
               *
               * Boring requires entrypoints to have an unique canonicalPath.
               * Why would the be different.  A pretty common use case many boring
               * routes will point to the "defaultEntrypoint.js" within boring,
               * which is the same file for many entrypoints but has different bundles
               * due to dynamic imports.
               */
              const entrypointArr = (methodObj.entrypoint instanceof Array) ? methodObj.entrypoint : [methodObj.entrypoint];

              const entrypoints = ['@babel/polyfill'].concat(entrypointArr.map(entrypoint => {
                if (entrypoint.assetPath) return entrypoint.assetPath;
                else return entrypoint;
              }));

              if (config.get('boring.useWebpackDevServer')) {
                entrypoints.unshift('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000');
              }

              collector[pathitize(methodObj.entrypoint)] = entrypoints;
            }
          });
        });

        return collector;
      }, {});

      if (config.get('boring.useWebpackDevServer') &&
        // only bother to run webpack if we someone
        // has actually used the @entrypoint decorator
        Object.keys(webpack_config.entry).length > 0) {
        const webpack = require('webpack');
        const compiler = webpack(webpack_config);

        const composedMiddleware = compose([
          webpackDevMiddleware(compiler, {
            serverSideRender: true,
            publicPath: '/',
          }),
          webpackHotMiddleware(compiler),
          function(req, res, next) {
            // TODO: this has some tight coupling here,
            // in the future we should decouple these two
            nodenopack.registerWebpackStats(res.locals.webpackStats.toJson());
            next();
          },
        ]);

        compiler.plugin('done', function(stats) {
          resolve(composedMiddleware);
        });
      } else {
        // passthrough in production
        resolve(function(req, res, next) {
          next();
        });
      }
    });
  });

  return deferMiddleware(webpackDevPromise);
};
