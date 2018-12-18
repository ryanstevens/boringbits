"use strict";

var _react = _interopRequireDefault(require("react"));

var _redux = _interopRequireDefault(require("redux"));

var _server = _interopRequireDefault(require("react-dom/server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * This module exposes the react modules
 * used by boring both by mutating the injections
 * and using injecture.  It may be important
 * for the webapp to use the exact same
 * version of the modules boring uses.
 */
module.exports = function (BoringInjections) {
  const {
    injecture
  } = BoringInjections;
  BoringInjections.react = _react.default;
  BoringInjections.redux = _redux.default;
  BoringInjections.ReactDOMServer = _server.default;
  injecture.register('react', function () {
    return _react.default;
  }, {
    singleton: true
  });
  injecture.register('redux', function () {
    return _redux.default;
  }, {
    singleton: true
  });
  injecture.register('ReactDOMServer', function () {
    return _server.default;
  }, {
    singleton: true
  });
};
//# sourceMappingURL=react.js.map