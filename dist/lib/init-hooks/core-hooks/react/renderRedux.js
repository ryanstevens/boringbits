"use strict";

var _react = _interopRequireDefault(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _reactRouterDom = require("react-router-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const path = require('path');

const paths = require('paths');

const config = require('boring-config');

const Layout = require('./Layout');

module.exports = function renderRedux(options = {
  layout: {
    clientConfig: {},
    headScripts: []
  }
}) {
  const res = this;
  const req = res.req;
  const context = {};

  const App = require(paths.app_dir + res.reactPaths.clientRoot + '/' + res.reactPaths.reactRoot + config.get('boring.react.mainApp', '/App.js')).default;

  const rootReducer = require(paths.app_dir + res.reactPaths.clientRoot + '/' + res.reactPaths.reactRoot + config.get('boring.react.reducers', '/reducers')).default;

  function Router(props) {
    return _react.default.createElement(_reactRouterDom.StaticRouter, {
      location: req.url,
      context: context,
      props: props
    }, props.children);
  }

  const dependencies = {
    App,
    Router,
    rootReducer
  };

  const getAppComponents = require('./AppInit').default;

  const {
    Container,
    getStyleSheets,
    store
  } = getAppComponents(dependencies);
  res.send('<!DOCTYPE html>' + _server.default.renderToStaticMarkup(_react.default.createElement(Layout, {
    getStyleSheets: getStyleSheets,
    locals: res.locals,
    client_config: options.layout.clientConfig,
    headScripts: options.layout.headScripts,
    redux_state: store.getState()
  }, _react.default.createElement(Container, null))));
};
//# sourceMappingURL=renderRedux.js.map