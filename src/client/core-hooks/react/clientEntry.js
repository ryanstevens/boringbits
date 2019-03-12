import ReactDOM from 'react-dom';
import React from 'react';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import injecture from 'injecture';
import createBrowserHistory from 'history/createBrowserHistory';
import getAppComponents from './AppInit';
import BoringRouter from './BoringRouter';
import isNode from 'detect-node';
import * as decoratorUntil from './decoratorUtil';
import {Frontload} from 'react-frontload';
import {preloadReady} from 'react-loadable';
import getRootComponents from './getRootComponents';
import {Helmet} from './ReactHelmet';

function extractStateFromDOM() {
  const state = {
    composeEnhancers: null,
  };
  try {
    const jssStyles = window.document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    state.preloadedState = window.__PRELOADED_STATE__ || {};
    state.composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  } catch (e) {}

  return state;
}

function renderRedux(App, reducers, Router) {

  const history = createBrowserHistory();

  function RouterWrapper(props) {
    return (
      <Router history={history} {...props}>
        <Frontload isServer={false}>
          {props.children}
        </Frontload>
      </Router>
    );
  }

  preloadReady().then((...args) => {
    const components = getAppComponents({
      App: App,
      reducers: reducers,
      history: history,
      Router: RouterWrapper,
      ...extractStateFromDOM(),
    });

    const Container = components.Container;

    ReactDOM.hydrate(
      <Container />,
      document.querySelector('#root')
    );
  });

  return Promise.resolve();
}


function subscribeHotReload(fn) {

  try {
    if (!__boring_internals.hot[fn.toString()]) {
      __boring_internals.hot.subscribe(fn);
      __boring_internals.hot[fn.toString()] = true;
      fn();
    }
  } catch (e) {
    console.log('ERROR', e);
  }
}

const toExport = {
  // vendor exports for convience
  React, // backwards compat, remove @ v4
  react: React,
  ReactDOM: ReactDOM, // backwards compat, remove @ v4
  Redux: Redux, // backwards compat, remove @ v4
  redux: Redux,
  ReactRedux: ReactRedux, // backwards compat, remove @ v4
  Helmet: Helmet,
  helmet: Helmet,
  injecture: injecture,
  isNode,

  // boring components
  renderRedux,
  BoringRouter: BoringRouter,
  MagicallyDeliciousRouter: BoringRouter,
  getRootComponents,
  getComponents: getRootComponents, // alias, I think we should remove getRootComponents in @v4
  subscribeHotReload,
  ...decoratorUntil,
};

toExport['react-redux'] = ReactRedux;
toExport['react-dom'] = ReactDOM;

module.exports = toExport;
