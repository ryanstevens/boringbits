"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = RouterSwitch;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _detectNode = _interopRequireDefault(require("detect-node"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function RouterSwitch() {
  if (_detectNode.default) {
    return _react.default.createElement(_react.default.Fragment, null);
  }

  const containers = window.__boring_internals.containers;
  let key = 0;
  return _react.default.createElement(_reactRouterDom.Switch, null, containers.map(component => {
    return _react.default.createElement(_reactRouterDom.Route, {
      key: key++,
      path: component.path,
      component: component.container
    });
  }));
}

;
//# sourceMappingURL=BoringRouter.js.map