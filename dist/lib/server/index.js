"use strict";

const config = require('boring-config');

const logger = require('boring-logger');

const paths = require('paths');

const util = require('util');

const InitPipeline = require('../init-pipeline');

async function startExpress(app, port) {
  app.listen = util.promisify(app.listen);
  return app.listen(port);
}

class BoringServer extends InitPipeline {
  constructor() {
    super();
  }

  async start(options) {
    const webpack_config_path = config.get('boring.isDevelopment', true) ? paths.boring_webpack_dev_config : paths.boring_webpack_prod_config;
    const injections = await this.build(Object.assign({}, {
      webpack_config: require(webpack_config_path)
    }, options));
    const port = process.env.PORT || config.get('boring.app.port');
    injections.port = port;
    return await this.perform('listen', injections, async () => {
      await startExpress(this.app, port);
      logger.info('Listening on port ' + port);
      return injections;
    });
  }

}

module.exports = BoringServer;
//# sourceMappingURL=index.js.map