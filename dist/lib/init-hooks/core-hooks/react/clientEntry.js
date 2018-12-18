"use strict";

var _reactDom = _interopRequireDefault(require("react-dom"));

var _react = _interopRequireDefault(require("react"));

var Redux = _interopRequireWildcard(require("redux"));

var ReactRedux = _interopRequireWildcard(require("react-redux"));

var _injecture = _interopRequireDefault(require("injecture"));

var _connectedReactRouter = require("connected-react-router");

var _createBrowserHistory = _interopRequireDefault(require("history/createBrowserHistory"));

var _AppInit = _interopRequireDefault(require("./AppInit"));

var _BoringRouter = _interopRequireDefault(require("./dynamicComponents/BoringRouter"));

var _detectNode = _interopRequireDefault(require("detect-node"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderRedux(App, reducers) {
  var history = (0, _createBrowserHistory.default)();

  function Router(props) {
    return _react.default.createElement(_connectedReactRouter.ConnectedRouter, {
      history: history
    }, props.children);
  }

  var components = (0, _AppInit.default)({
    App: App,
    reducers: reducers,
    history: history,
    Router: Router
  });
  var Container = components.Container;

  _reactDom.default.hydrate(_react.default.createElement(Container, null), document.querySelector('#root'));

  return components;
}

const toExport = {
  renderRedux: renderRedux,
  React: _react.default,
  //backwards compat, remove @ v4
  react: _react.default,
  ReactDOM: _reactDom.default,
  //backwards compat, remove @ v4
  Redux: Redux,
  //backwards compat, remove @ v4
  redux: Redux,
  injecture: _injecture.default,
  ReactRedux: ReactRedux,
  //backwards compat, remove @ v4
  BoringRouter: _BoringRouter.default,
  MagicallyDeliciousRouter: _BoringRouter.default
};
toExport['react-redux'] = ReactRedux;
toExport['react-dom'] = _reactDom.default;
module.exports = toExport;
//# sourceMappingURL=clientEntry.js.map