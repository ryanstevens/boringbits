const InitPipeline = require('./init-pipeline');
const paths = require('paths');

class Builder extends InitPipeline {

  async start(options) {
    return await this.build(Object.assign({}, {
      webpack_config: require(paths.boring_webpack_prod_config)
    }, options));

  }
}

module.exports = new Builder();