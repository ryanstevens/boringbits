"use strict";

var _server = _interopRequireDefault(require("./lib/server"));

var _injecture = _interopRequireDefault(require("injecture"));

var _boringLogger = _interopRequireDefault(require("boring-logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const config = require('boring-config');

if (config.get('boring.babel_project') === true) {
  require('@babel/register')({
    // ignore: [],
    "presets": [["@babel/preset-env", {
      "targets": {
        "node": "10.9.0"
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
  logger: _boringLogger.default
};
//# sourceMappingURL=boring.js.map