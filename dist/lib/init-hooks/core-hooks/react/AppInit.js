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

var _reactRouterRedux = require("react-router-redux");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAppComponents(dependencies = {}) {
  // Grab the state from a global variable injected into the server-generated HTML
  let preloadedState = undefined;
  const App = dependencies.App;
  const rootReducer = dependencies.rootReducer;

  try {
    if (window && window.__PRELOADED_STATE__) {
      preloadedState = window.__PRELOADED_STATE__;
      delete window.__PRELOADED_STATE__;
    }
  } catch (e) {}

  const middleware = [];
  if (dependencies.history) middleware.push((0, _reactRouterRedux.routerMiddleware)(dependencies.history));
  const Router = dependencies.Router;
  const store = (0, _redux.createStore)(rootReducer, preloadedState, (0, _redux.applyMiddleware)(...middleware)); // Create a new class name generator.

  const generateClassName = (0, _styles.createGenerateClassName)();
  const sheetsRegistry = new _jss.SheetsRegistry();

  class Main extends _react.default.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
      if (window && window.document) {
        const jssStyles = window.document.getElementById('jss-server-side');

        if (jssStyles && jssStyles.parentNode) {
          jssStyles.parentNode.removeChild(jssStyles);
        }
      }
    }

    render() {
      return _react.default.createElement(_reactRedux.Provider, {
        store: store
      }, _react.default.createElement(Router, null, _react.default.createElement(_JssProvider.default, {
        registry: sheetsRegistry,
        generateClassName: generateClassName
      }, _react.default.createElement(App, null))));
    }

  }
  /**
   * This meant to be called on the server
   * AFTER MAIN is renedered.
   */


  function getStyleSheets() {
    return sheetsRegistry.toString();
  }

  const Container = Main;
  return {
    Container,
    getStyleSheets,
    store
  };
}
//# sourceMappingURL=AppInit.js.map