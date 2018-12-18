"use strict";

var _react = _interopRequireDefault(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _reactRouterDom = require("react-router-dom");

var _Layout = _interopRequireDefault(require("./Layout"));

var _AppInit = _interopRequireDefault(require("./AppInit"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function renderRedux(options = {
  layout: {
    clientConfig: {},
    pageInjections: {}
  }
}) {
  const res = this;
  const req = res.req;
  const context = {};
  const {
    reactPaths
  } = res;

  const App = require(reactPaths.mainApp).default;

  const reducers = require(reactPaths.reducers).default;

  function Router(props) {
    return _react.default.createElement(_reactRouterDom.StaticRouter, {
      location: req.url,
      context: context,
      props: props
    }, props.children);
  }

  const {
    Container,
    getStyleSheets,
    store
  } = (0, _AppInit.default)({
    App,
    Router,
    reducers
  });
  const layout = options.layout || {
    clientConfig: {},
    pageInjections: {}
  };
  res.send('<!DOCTYPE html>' + _server.default.renderToStaticMarkup(_react.default.createElement(_Layout.default, {
    getStyleSheets: getStyleSheets,
    locals: res.locals,
    client_config: layout.clientConfig,
    pageInjections: layout.pageInjections,
    redux_state: store.getState()
  }, _react.default.createElement(Container, null))));
};
//# sourceMappingURL=renderRedux.js.map