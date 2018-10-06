"use strict";

var _server = _interopRequireDefault(require("./lib/server"));

var _injecture = _interopRequireDefault(require("injecture"));

var _boringConfig = _interopRequireDefault(require("boring-config"));

var _boringLogger = _interopRequireDefault(require("boring-logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  Server: _server.default,
  Injecture: _injecture.default,
  config: _boringConfig.default,
  logger: _boringLogger.default
};
//# sourceMappingURL=boring.js.map