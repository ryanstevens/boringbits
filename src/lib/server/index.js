if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

const config = require('boring-config');
const logger = require('boring-logger');
const paths = require('paths');
const util = require('util');
const InitPipeline = require('../init-pipeline');
const deferitize = require('deferitize');
const express = require('express');

async function startExpress(app, port) {
  app.listen = util.promisify(app.listen);
  return await app.listen(port);
}

async function noopListen(app, port) {
  return {};
}

class BoringServer extends InitPipeline {

  constructor(args={}) {
    // allow express to be dependency injected,
    // but make an instance if it isn't
    if (!args.app) args.app = express();
    const listen = deferitize();
    let queuedRequests = [];

    args.app.use(function requestQueuer(req, res, next) {
      if (!queuedRequests) return next();

      logger.info('Boring listen has not been performed, queuing ' + req.url);
      queuedRequests.push({
        next,
      });
    });

    listen.then(() => {
      logger.info(`Flushing ${queuedRequests.length} queued requests`);
      queuedRequests.forEach(ctx => ctx.next());
      queuedRequests = null;
    });

    super(args);


    // this feels a little redundant to the `this.perform('listen')`
    // interceptor.  These two are actually coupled, and
    // this.listen is more or less a convenience over this.after('listen');
    this.listen = listen;
  }

  async start(options) {

    const webpackConfig = config.get('boring.isDevelopment', true) ?
      paths.boring_webpack_dev_config : paths.boring_webpack_prod_config;

    const injections = await this.build({
      port: process.env.PORT || config.get('boring.app.port'),
      webpack_config: require(webpackConfig),
      startExpress: config.get('boring.express.noopListen', false) ? noopListen : startExpress,
      ...options,
    });

    return await this.perform('listen', injections, async () => {
      const port = injections.port;
      // assume app.listen returns net.Server
      // https://nodejs.org/api/net.html#net_server_listen_options_callback
      const netServer = await injections.startExpress(this.app, port);
      logger.info('Listening on port ' + port);
      this.listen.resolve(netServer);

      return injections;
    });


  }
}

module.exports = BoringServer;
