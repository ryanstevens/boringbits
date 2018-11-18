"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const config = require('boring-config');

const express = require('express');

const initRouters = require('./init-routers');

const logger = require('boring-logger');

const initMiddleware = require('./init-middleware');

const initHooks = require('./init-hooks');

const EventEmitter = require('eventemitter2');

const paths = require('paths');

const Understudy = require('boring-understudy');

const decorators = require('./decorators');

const appUseOverride = require('./server/appUseOverride');

class InitPipeline extends EventEmitter {
  constructor() {
    super({
      wildcard: true
    });
    Understudy.call(this);
    this.config = config;
    this.logger = logger;
    this.paths = paths;
    this.middleware = {};
    this.hooks = {};
    this.app = express();
    this.decorators = decorators;
    this.app.oldUse = this.app.use;
    const perform = this.perform.bind(this);
    this.app.use = appUseOverride(this.app, perform);
  }

  add_middleware(name, middleware) {
    if (this.middleware[name]) throw new Error('Cannot add middleware with the same key as ' + name);
    this.middleware[name] = middleware;
    this.emit('added.middleware', name, middleware);
  }

  add_hook(name, hook) {
    if (this.hooks[name]) throw new Error('Cannot add hook with the same key as ' + name);
    this.hooks[name] = hook;
    this.emit('added.hook', name, hook);
  }

  add_router(router) {
    const routePath = router.path || '';
    const app = this.app;
    router.endpoints.forEach((endpoint = {
      path: '',
      methods: {}
    }) => {
      // don't blow up if there are no methods
      const methods = endpoint.methods || {};
      Object.keys(methods).forEach(method => {
        let path = routePath + endpoint.path;
        let handler = endpoint.methods[method]; // this IF checks to see
        // if handler is an object rather
        // than a function

        if (handler.handler) handler = handler.handler;
        app[method](path, handler);
        logger.info(`Installed {${method.toUpperCase()}} for path ${path}`);
      });
      this.emit('added.endpoint', endpoint);
    });
  }

  build(options) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let injections = Object.assign({}, {
        boring: _this
      }, options);
      const hooks = yield _this.perform('init-hooks', injections,
      /*#__PURE__*/
      _asyncToGenerator(function* () {
        return yield initHooks(injections);
      }));
      injections.hooks = hooks;
      yield _this.perform('add-hooks', injections,
      /*#__PURE__*/
      _asyncToGenerator(function* () {
        Object.keys(injections.hooks).forEach(name => _this.add_hook(name, injections.hooks[name]));
        return injections;
      }));
      const middleware = yield _this.perform('init-middleware', injections,
      /*#__PURE__*/
      _asyncToGenerator(function* () {
        return yield initMiddleware(injections);
      }));
      injections.middleware = middleware;
      yield _this.perform('add-middleware', injections,
      /*#__PURE__*/
      _asyncToGenerator(function* () {
        Object.keys(injections.middleware).forEach(name => _this.add_middleware(name, injections.middleware[name]));
        return injections;
      }));
      const routers = yield _this.perform('init-routers', injections,
      /*#__PURE__*/
      _asyncToGenerator(function* () {
        return yield initRouters(injections);
      }));
      injections.routers = routers;
      yield _this.perform('add-routers', injections,
      /*#__PURE__*/
      _asyncToGenerator(function* () {
        injections.routers.forEach(route => _this.add_router(route));
        return injections;
      }));
      return injections;
    })();
  }

}

function deferMiddleware(middlewarePromise) {
  let queuing = true;
  return function proxyMiddleware(req, res, next) {
    if (queuing) logger.info('App use has not finished loading middleware, queuing ' + req.url);
    middlewarePromise.then(deferedMiddleware => {
      queuing = false;
      deferedMiddleware(req, res, next);
    }).catch(e => {
      throw e;
    });
  };
}

module.exports = InitPipeline;
//# sourceMappingURL=init-pipeline.js.map