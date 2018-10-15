"use strict";

var _boringConfig = _interopRequireDefault(require("boring-config"));

var _server = _interopRequireDefault(require("./lib/server"));

var _injecture = _interopRequireDefault(require("injecture"));

var _boringLogger = _interopRequireDefault(require("boring-logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_boringConfig.default.get('boring.babel_project') === true) {
  require('@babel/register');
}

module.exports = {
  Server: _server.default,
  Injecture: _injecture.default,
  config: _boringConfig.default,
  logger: _boringLogger.default
};
//# sourceMappingURL=boring.js.map