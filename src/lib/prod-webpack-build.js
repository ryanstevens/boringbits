require('../babel_register');

const nodeAppPath = require('app-module-path');
nodeAppPath.addPath(process.cwd() + '/src');

const paths = require('paths');
const InitPipeline = require('./init-pipeline');

class Builder extends InitPipeline {

  async start(options) {
    return await this.build(Object.assign({}, {
      webpack_config: require(paths.boring_webpack_prod_config),
    }, options));

  }
}

module.exports = new Builder();
