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

    const injections = await this.build(Object.assign({}, {
      webpack_config: require(paths.boring_webpack_dev_config)
    }, options));

    const port = config.get('boring.app.port');
    injections.port = port;
    
    return await this.perform('listen', injections, async() => {
      await startExpress(this.app, port);
      logger.info('Listening on port ' + port);
  
      return injections;
    })
   
  }
}

module.exports = BoringServer