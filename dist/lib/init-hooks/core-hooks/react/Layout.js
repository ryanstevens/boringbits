"use strict";

var _react = _interopRequireDefault(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

module.exports = class HTML extends _react.default.Component {
  render() {
    const reduxHtml = `window.__PRELOADED_STATE__=${JSON.stringify(this.props.redux_state).replace(/</g, '\\u003c')}`;
    const app_vars = `
      window.app_vars = {
        server_load_time: ${new Date().getTime()},
        client_load_start : (new Date()).getTime(),
        config: ${JSON.stringify(this.props.client_config || {})},
        loggedIn: ${this.props.locals.loggedIn}
      }
    `;
    const pageInjections = Object.assign({
      headLinks: [],
      headScripts: [],
      bodyEndScripts: []
    }, this.props.pageInjections);
    pageInjections.headLinks = pageInjections.headLinks.concat(this.props.locals.pageInjections.headLinks || []);
    pageInjections.headScripts = pageInjections.headScripts.concat(this.props.locals.pageInjections.headScripts || []);
    pageInjections.bodyEndScripts = pageInjections.bodyEndScripts.concat(this.props.locals.pageInjections.bodyEndScripts || []);

    const app = _server.default.renderToString(this.props.children);

    return _react.default.createElement("html", {
      style: {
        height: '100%'
      }
    }, _react.default.createElement("head", null, _react.default.createElement("meta", {
      charSet: "utf-8"
    }), _react.default.createElement("script", {
      dangerouslySetInnerHTML: {
        __html: app_vars
      }
    }), _react.default.createElement("link", {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css?family=Roboto:300,400,500"
    }), _react.default.createElement("link", {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/icon?family=Material+Icons"
    }), _react.default.createElement("meta", {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
    }), pageInjections.headScripts.map(scriptObj => _react.default.createElement("script", _extends({
      key: scriptObj.src
    }, scriptObj))), pageInjections.headLinks.map(linkObj => _react.default.createElement("link", _extends({
      key: linkObj.src
    }, linkObj)))), _react.default.createElement("body", {
      style: {
        height: '100%',
        padding: '0px',
        margin: '0px'
      }
    }, _react.default.createElement("style", {
      dangerouslySetInnerHTML: {
        __html: this.props.getStyleSheets()
      },
      id: "jss-server-side"
    }), _react.default.createElement("div", {
      style: {
        width: '100%',
        height: '100%'
      },
      id: "root",
      dangerouslySetInnerHTML: {
        __html: app
      }
    }), pageInjections.bodyEndScripts.map(scriptObj => _react.default.createElement("script", _extends({
      key: scriptObj.src
    }, scriptObj))), _react.default.createElement("script", {
      dangerouslySetInnerHTML: {
        __html: reduxHtml
      }
    })));
  }

};
//# sourceMappingURL=Layout.js.map