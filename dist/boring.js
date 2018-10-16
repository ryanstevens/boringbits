"use strict";

var _server = _interopRequireDefault(require("./lib/server"));

var _injecture = _interopRequireDefault(require("injecture"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const config = require('boring-config');

const logger = require('boring-logger');

if (config.get('boring.babel.register_app') === true) {
  logger.info('babelifying codebase via @babel/register');

  require('@babel/register')({
    // ignore: [],
    "presets": [["@babel/preset-env", {
      "targets": {
        "node": config.get('boring.babel.node_target', '10.9.0')
      }
    }], '@babel/preset-react'],
    "plugins": ["@babel/plugin-proposal-object-rest-spread", ["@babel/plugin-proposal-decorators", {
      legacy: true
    }]]
  });
}

module.exports = {
  Server: _server.default,
  Injecture: _injecture.default,
  config,
  logger
};
//# sourceMappingURL=boring.js.map