"use strict";

var _server = _interopRequireDefault(require("./lib/server"));

var _injecture = _interopRequireDefault(require("injecture"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const config = require('boring-config');

const logger = require('boring-logger');

if (config.get('boring.babel.register_app') === true) {
  logger.info('babelifying codebase via @babel/register');

  require('./babel_register');
}

module.exports = {
  Server: _server.default,
  Injecture: _injecture.default,
  config,
  logger
};
//# sourceMappingURL=boring.js.map