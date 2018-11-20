import paths from 'paths';
import requireInject from 'require-inject-all';
import logger from 'boring-logger';
import injecture from 'injecture';
import endpoint_transformer from './transform-annotation';
//import * as decorators from '../decorators'
const compose = require('compose-middleware').compose;


module.exports = async function initRoutes(BoringInjections) {
  const {
    boring,
  } = BoringInjections;

  const decorators = boring.decorators;

  const endpoint_meta = [];

  /**
   * !IMPORTANT!
   *
   * First, we *must* subscribe the decorators to boring's
   * event emitter.  This way we will know all the classes
   * used by the @endpoint decorator.  THEN we can
   * use requireInject to actually require the files
   */
  boring.on('decorator.router.endpoint', (eventData) => {

    const metadata= decorators.router.getMetaDataByClass(eventData.target).metadata
    endpoint_meta.push(endpoint_transformer(metadata));
  });
  boring.decorators.subscribeDecorators(boring);

  /**
   * Now we just took care of any future enpoints,
   * let's grab all of the endpoints defined before
   * this point in the boot sequence, such as middleware
   */
  const instances = injecture.allInstances('decorator.router.endpoint');

  instances.forEach((Klass) => {
    const metadata = decorators.router.getMetaDataByClass(Klass).metadata;
    endpoint_meta.push(endpoint_transformer(metadata));
  });


  const moduleData = await requireInject([paths.boring_routers, paths.server_routers], boring);

  const route_descriptors = endpoint_meta.concat(Object.keys(moduleData).map((name) => {
    const route = moduleData[name] || { endpoints: [] };
    // If the route does not already have a name
    // then use the name of the module.  This object.name
    // will be added to the route_meta array
    // and NOT guranteed to be unique.  The name
    // serves simply as an identifier in logging
    if (!route.name) route.name = name;

    return route;
  }));

  route_descriptors.forEach((route) => {
    route.endpoints.forEach((endpoint) => {
      const methods = endpoint.methods || {};
      Object.keys(methods).forEach((method) => {
        wrapHandler(boring, route, endpoint, methods, method);
      });
    });
  });

  return route_descriptors;
};

function noop(req, res, next) {
  next();
}

function getMiddlewareFunc(boring, middleware) {
  if (typeof middleware === 'string') {
    return boring.middleware[middleware] || noop;
  }

  if (typeof middleware === 'function') {
    return middleware;
  }
}

// this is extracted from the code
// below to not enclose all the objects
// within initRoutes.  These handlers
// will be wrapped and always in the heap
function wrapHandler(boring, route, endpoint, methods, method) {
  // first, normalize the middleware
  let middlewareStack = endpoint.middleware || [];
  if (typeof endpoint.middleware === 'function') {
    middlewareStack = [middlewareStack];
  }

  const normalizedMiddleware = middlewareStack.map((middleware) => {
    let func = getMiddlewareFunc(boring, middleware);
    if (func) return func;

    if (middleware && middleware.args) {
      func = getMiddlewareFunc(boring, middleware.func);
      return function curryWrapper(req, res, next) {
        func(req, res, next, middleware.args);
      };
    }
  });


  // normalize data structure to match
  // decorator API
  if (typeof methods[method] === 'function') {
    const func = methods[method];
    methods[method] = {
      handler: func,
    };
  }

  const handler = methods[method].handler;
  methods[method].handler = function wrappedHandler(req, res, next) {
    const ctx = {
      req,
      res,
      next,
      route,
      endpoint,
      method,
      middleware: normalizedMiddleware
    };
    ctx[method] = methods[method];

    // first execute the middleware
    boring.perform(`http::${method.toLowerCase()}::middleware`, ctx, () => new Promise(function(resolve, reject) {

      compose(ctx.middleware)(ctx.req, ctx.res, function(err) {
        if (err) return reject(err);
        resolve(ctx);
      });

    }))
    .then(() => {
    // then execte handler
      boring.perform(`http::${method.toLowerCase()}`, ctx, async function () {
        handler.call(this, ctx.req, ctx.res, ctx.next);
        return ctx;
      }).catch((e) => {
        logger.info(e, `There was rejection from a http::${method} interceptor`);
      });
    })
    .catch((e) => {
      logger.info(e, `There was rejection from a http::${method}::middleware interceptor`);
    });

  };
}
