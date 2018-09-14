const config = require('boring-config');
const express = require('express');
const initEndpoints = require('../init-endpoints');
const initMiddleware = require('../init-middleware');
const initHooks = require('../init-hooks');
const logger = require('boring-logger');
const EventEmitter = require('eventemitter2');
const paths = require('paths');
const Understudy = require('boring-understudy');
const util = require('util');

async function startExpress(app, port) {
  app.listen = util.promisify(app.listen);
  return app.listen(port);
}

class Server extends EventEmitter  {

  constructor() {
    super({wildcard: true});
    Understudy.call(this);
    this.config = config;
    this.logger = logger;
    this.paths = paths;

    this.middleware = {};
    this.hooks = {};
    this.app = express();
  }

  add_middleware(name, middleware) {
    if (this.middleware[name]) throw new Error('Cannot add middleware with the same key as '+ name)
    this.middleware[name] = middleware;
    this.emit('added.middleware', name, middleware);
  }

  add_hook(name, hook) {
    if (this.hooks[name]) throw new Error('Cannot add hook with the same key as '+ name)
    this.hooks[name] = hook;
    this.emit('added.hook', name, hook);
  }

  add_endpoint(route) {

    const routePath = route.path || '';
    const app = this.app;

    route.endpoints.forEach((endpoint = {path: '', methods: {}}) => {
        
      // don't blow up if there are no methods
      const methods = endpoint.methods || {};
      Object.keys(methods).forEach(method => {
        let path = routePath + endpoint.path;
        let handler = endpoint.methods[method];
        // this IF checks to see
        // if handler is an object rather
        // than a function 
        if (handler.handler) handler = handler.handler
    
        app[method](path, handler);
        logger.info(`Installed {${method.toUpperCase()}} for path ${path}`); 
      });
      
      this.emit('added.endpoint', endpoint);
    })

  }

  async start(options = {}) {

    let injections = {
      boring: this,
      start_options: options,
      webpack_config: require(paths.boring_webpack_dev_config)
    }

    const middleware = await this.perform('init-middleware', injections, async () => {
      return await initMiddleware(injections);
    })
    
    const hooks = await this.perform('init-hooks', injections, async () => {
      return await initHooks(injections);
    })
  
    const routes = await this.perform('init-endpoints', injections, async () => {
      return await initEndpoints(injections);
    })

    await this.perform('mount-routes', routes, async() => {
      routes.forEach(route => this.add_endpoint(route));
      return routes;
    })
   
    const port = config.get('app.port', 5000);
    injections.port = port;

    return await this.perform('listen', injections, async () => {

      startExpress(this.app, port);
      logger.info('Listening on port ' + port);

      return injections;
    });

  }
}



module.exports = Server