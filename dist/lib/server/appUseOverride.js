"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const logger = require('boring-logger');

module.exports = function (app, perform) {
  const oldUse = app.use.bind(app);
  return function wrappedUse(name, middleware) {
    if (typeof name === 'function') {
      middleware = name;
      name = middleware.name; // just use the name of the function
    }

    let ctx = {
      middleware,
      name
    };
    oldUse(deferMiddleware(name, new Promise(function (resolve, reject) {
      logger.info('Registering middielware::' + ctx.name);
      perform('app.use', ctx,
      /*#__PURE__*/
      _asyncToGenerator(function* () {
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
      })).catch(reject);
    })));
  };
};

function deferMiddleware(name, middlewarePromise) {
  let queuing = true;
  return function proxyMiddleware(req, res, next) {
    if (queuing) logger.info(`App use has not finished loading middleware ${name}, queuing ${req.url}`);
    middlewarePromise.then(deferedMiddleware => {
      queuing = false;
      deferedMiddleware(req, res, next);
    }).catch(e => {
      throw e;
    });
  };
}
//# sourceMappingURL=appUseOverride.js.map