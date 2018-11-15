"use strict";

var _reactDom = _interopRequireDefault(require("react-dom"));

var _react = _interopRequireDefault(require("react"));

var _reactRouterRedux = require("react-router-redux");

var _createBrowserHistory = _interopRequireDefault(require("history/createBrowserHistory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getAppComponents = require('./AppInit').default;

function render(App, rootReducer) {
  function Router(props) {
    const history = (0, _createBrowserHistory.default)();
    return _react.default.createElement(_reactRouterRedux.ConnectedRouter, {
      history: history
    }, props.children);
  }

  const {
    Container
  } = getAppComponents({
    App,
    rootReducer,
    history,
    Router
  });

  _reactDom.default.hydrate(_react.default.createElement(Container, null), document.querySelector('#root'));
}

window.__boring = {
  render
};
//# sourceMappingURL=clientEntry.js.map