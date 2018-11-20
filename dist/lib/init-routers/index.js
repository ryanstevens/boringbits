"use strict";

var _paths = _interopRequireDefault(require("paths"));

var _requireInjectAll = _interopRequireDefault(require("require-inject-all"));

var _boringLogger = _interopRequireDefault(require("boring-logger"));

var _injecture = _interopRequireDefault(require("injecture"));

var _transformAnnotation = _interopRequireDefault(require("./transform-annotation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//import * as decorators from '../decorators'
const compose = require('compose-middleware').compose;

module.exports =
/*#__PURE__*/
function () {
  var _initRoutes = _asyncToGenerator(function* (BoringInjections) {
    const {
      boring
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

    boring.on('decorator.router.endpoint', eventData => {
      const metadata = decorators.router.getMetaDataByClass(eventData.target).metadata;
      endpoint_meta.push((0, _transformAnnotation.default)(metadata));
    });
    boring.decorators.subscribeDecorators(boring);
    /**
     * Now we just took care of any future enpoints,
     * let's grab all of the endpoints defined before
     * this point in the boot sequence, such as middleware
     */

    const instances = _injecture.default.allInstances('decorator.router.endpoint');

    instances.forEach(Klass => {
      console.log("###############", Klass);
      const metadata = decorators.router.getMetaDataByClass(Klass).metadata;
      endpoint_meta.push((0, _transformAnnotation.default)(metadata));
    });
    const moduleData = yield (0, _requireInjectAll.default)([_paths.default.boring_routers, _paths.default.server_routers], boring);
    const route_descriptors = endpoint_meta.concat(Object.keys(moduleData).map(name => {
      const route = moduleData[name] || {
        endpoints: []
      }; // If the route does not already have a name
      // then use the name of the module.  This object.name
      // will be added to the route_meta array
      // and NOT guranteed to be unique.  The name
      // serves simply as an identifier in logging

      if (!route.name) route.name = name;
      return route;
    }));
    route_descriptors.forEach(route => {
      route.endpoints.forEach(endpoint => {
        const methods = endpoint.methods || {};
        Object.keys(methods).forEach(method => {
          wrapHandler(boring, route, endpoint, methods, method);
        });
      });
    });
    return route_descriptors;
  });

  return function initRoutes(_x) {
    return _initRoutes.apply(this, arguments);
  };
}();

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
} // this is extracted from the code
// below to not enclose all the objects
// within initRoutes.  These handlers
// will be wrapped and always in the heap


function wrapHandler(boring, route, endpoint, methods, method) {
  // first, normalize the middleware
  let middlewareStack = endpoint.middleware || [];

  if (typeof endpoint.middleware === 'function') {
    middlewareStack = [middlewareStack];
  }

  const normalizedMiddleware = middlewareStack.map(middleware => {
    let func = getMiddlewareFunc(boring, middleware);
    if (func) return func;

    if (middleware && middleware.args) {
      func = getMiddlewareFunc(boring, middleware.func);
      return function curryWrapper(req, res, next) {
        func(req, res, next, middleware.args);
      };
    }
  }); // normalize data structure to match
  // decorator API

  if (typeof methods[method] === 'function') {
    const func = methods[method];
    methods[method] = {
      handler: func
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
    ctx[method] = methods[method]; // first execute the middleware

    boring.perform(`http::${method.toLowerCase()}::middleware`, ctx, () => new Promise(function (resolve, reject) {
      compose(ctx.middleware)(ctx.req, ctx.res, function (err) {
        if (err) return reject(err);
        resolve(ctx);
      });
    })).then(() => {
      // then execte handler
      boring.perform(`http::${method.toLowerCase()}`, ctx,
      /*#__PURE__*/
      _asyncToGenerator(function* () {
        handler.call(this, ctx.req, ctx.res, ctx.next);
        return ctx;
      })).catch(e => {
        _boringLogger.default.info(e, `There was rejection from a http::${method} interceptor`);
      });
    }).catch(e => {
      _boringLogger.default.info(e, `There was rejection from a http::${method}::middleware interceptor`);
    });
  };
}
//# sourceMappingURL=index.js.map