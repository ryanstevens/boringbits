
const config = require('boring-config');
const logger = require('boring-logger');
const nodeAppPath = require('app-module-path');
const isNode = require('detect-node');
const getLambda = require('./boring_lambda');

const isDevelopment = config.get('boring.isDevelopment', true);

nodeAppPath.addPath(process.cwd() + (isDevelopment ? '/src' : '/dist'));

if (config.get('boring.babel.register_app') === true) {
  logger.info('babelifying codebase via @babel/register');
  require('./babel_register');
}

const Server = require('./lib/server');
const injecture = require('injecture');
const boringCls = require('boring-cls');

module.exports = {
  Server,
  injecture,
  config,
  logger,
  isNode,
  getLambda,
  ...boringCls,
};
