"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getAppComponents;

var _react = _interopRequireDefault(require("react"));

var _jss = require("react-jss/lib/jss");

var _JssProvider = _interopRequireDefault(require("react-jss/lib/JssProvider"));

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _styles = require("@material-ui/core/styles");

var _connectedReactRouter = require("connected-react-router");

var _detectNode = _interopRequireDefault(require("detect-node"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extractStateFromDOM() {
  var state = {
    composeEnhancers: _redux.compose
  };

  try {
    if (!_detectNode.default) {
      var jssStyles = window.document.getElementById('jss-server-side');

      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }

      state.preloadedState = window.__PRELOADED_STATE__ || {};
      state.composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _redux.compose;
    }
  } catch (e) {}

  return state;
}

function getAppComponents(dependencies) {
  // Grab the state from a global variable injected into the server-generated HTML
  var domExtractedState = extractStateFromDOM();
  var preloadedState = domExtractedState.preloadedState;
  var composeEnhancers = domExtractedState.composeEnhancers;
  var App = dependencies.App;
  var reducers = dependencies.reducers;
  var middleware = [];

  if (dependencies.history) {
    middleware.push((0, _connectedReactRouter.routerMiddleware)(dependencies.history));
    reducers.router = (0, _connectedReactRouter.connectRouter)(dependencies.history);
  }

  var Router = dependencies.Router;
  var enhancer = composeEnhancers(_redux.applyMiddleware.apply(null, middleware));
  var store = (0, _redux.createStore)((0, _redux.combineReducers)(reducers), preloadedState, enhancer); // Create a new class name generator.

  var generateClassName = (0, _styles.createGenerateClassName)();
  var sheetsRegistry = new _jss.SheetsRegistry();
  /**
   * This meant to be called on the server
   * AFTER MAIN is renedered.
   */

  function getStyleSheets() {
    return sheetsRegistry.toString();
  }

  function Container() {
    return _react.default.createElement(_reactRedux.Provider, {
      store: store
    }, _react.default.createElement(Router, null, _react.default.createElement(_JssProvider.default, {
      registry: sheetsRegistry,
      generateClassName: generateClassName
    }, _react.default.createElement(App, null))));
  }

  return {
    Container: Container,
    getStyleSheets: getStyleSheets,
    store: store
  };
}
//# sourceMappingURL=AppInit.js.map