const config = require('boring-config');
const express = require('express');
const initRouters = require('./init-routers');
const logger = require('boring-logger');
const initMiddleware = require('./init-middleware');
const initHooks = require('./init-hooks');
const EventEmitter = require('eventemitter2');
const paths = require('paths');
const Understudy = require('boring-understudy');

class Builder extends EventEmitter  {

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


  async build(webpack_config) {

    let injections = {
      boring: this,
      start_options: {},
      webpack_config
    }

    const middleware = await this.perform('init-middleware', injections, async () => {
      return await initMiddleware(injections);
    })

    await this.perform('add-middleware', injections, async() => {
      return middleware;
    })
  
    const hooks = await this.perform('init-hooks', injections, async () => {
      return await initHooks(injections);
    })

    await this.perform('add-hooks', hooks, async() => {
      return hooks;
    })
  
    const routers = await this.perform('init-routers', injections, async () => {
      return await initRouters(injections);
    })

    await this.perform('add-routers', {middleware, routers}, async() => {})

    return injections;
  }
}

module.exports = new Builder();