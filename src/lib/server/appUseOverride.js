const logger = require('boring-logger');

module.exports = function(app, perform) {
  const oldUse = app.use.bind(app);
  return function wrappedUse(name, middleware) {

    if (typeof name === 'function') {
      middleware = name;
      name = middleware.name; // just use the name of the function
    }

    let ctx = {
      middleware,
      name,
    }

    oldUse(deferMiddleware(name, new Promise(function(resolve, reject) {

      logger.info('Registering middleware::' + ctx.name);
      perform('app.use', ctx, async function() {
        // This in a way acts a dependency
        // system where a hook can only
        // effectively call app.use AFTER or
        // before a dependency.
        //
        // In theory this has the danger of
        // creating a cycle.  Maybe in the
        // future we can avoid that
        resolve(ctx.middleware);
        return ctx;
      }).catch(reject);

    })))

   };

}

function deferMiddleware(name, middlewarePromise) {

  let queuing = true;
  return function proxyMiddleware(req, res, next) {
    if (queuing) logger.info(`App use has not finished loading middleware {${name}}, queuing ${req.url}`);
    middlewarePromise.then(deferedMiddleware => {
      queuing = false;
      deferedMiddleware(req, res, next);
    }).catch((e) => {
      throw e;
    })
  }
}
