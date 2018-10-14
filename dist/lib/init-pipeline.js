"use strict";

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

    this.app.use = (name, middleware) => {
      if (typeof name === 'function') {
        middleware = name;
        name = middleware.name; // just use the name of the function
      }

      let ctx = {
        middleware,
        name // this.app.oldUse(middleware);

      };
      this.app.oldUse(deferMiddleware(new Promise(function (resolve, reject) {
        perform('app.use', ctx, async function () {
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
      })));
    };
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

  async build(options) {
    let injections = Object.assign({}, {
      boring: this
    }, options);
    const hooks = await this.perform('init-hooks', injections, async () => {
      return await initHooks(injections);
    });
    injections.hooks = hooks;
    await this.perform('add-hooks', injections, async () => {
      Object.keys(injections.hooks).forEach(name => this.add_hook(name, injections.hooks[name]));
      return injections;
    });
    const middleware = await this.perform('init-middleware', injections, async () => {
      return await initMiddleware(injections);
    });
    injections.middleware = middleware;
    await this.perform('add-middleware', injections, async () => {
      Object.keys(injections.middleware).forEach(name => this.add_middleware(name, injections.middleware[name]));
      return injections;
    });
    const routers = await this.perform('init-routers', injections, async () => {
      return await initRouters(injections);
    });
    injections.routers = routers;
    await this.perform('add-routers', injections, async () => {
      injections.routers.forEach(route => this.add_router(route));
      return injections;
    });
    return injections;
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