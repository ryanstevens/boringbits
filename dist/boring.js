"use strict";

var _server = _interopRequireDefault(require("./lib/server"));

var _injecture = _interopRequireDefault(require("injecture"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const config = require('boring-config');

const logger = require('boring-logger');

const node_app_path = require('app-module-path');

const isDevelopment = config.get('boring.isDevelopment', true);
node_app_path.addPath(process.cwd() + (isDevelopment ? '/src' : '/dist'));

if (config.get('boring.babel.register_app') === true) {
  logger.info('babelifying codebase via @babel/register');

  require('./babel_register');
}

module.exports = {
  Server: _server.default,
  injecture: _injecture.default,
  config,
  logger
};
//# sourceMappingURL=boring.js.map