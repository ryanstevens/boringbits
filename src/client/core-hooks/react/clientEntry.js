import ReactDOM from 'react-dom';
import React from 'react';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import injecture from 'injecture';
import {ConnectedRouter} from 'connected-react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import getAppComponents from './AppInit';
import BoringRouter from './BoringRouter';
import isNode from 'detect-node';
import * as decoratorUntil from './decoratorUtil';
import {Frontload} from 'react-frontload';
import {preloadReady} from 'react-loadable';


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

function renderRedux(App, reducers) {

  const history = createBrowserHistory();
  function Router(props) {
    return (
      <ConnectedRouter history={history}>
        <Frontload isServer={false}>
          {props.children}
        </Frontload>
      </ConnectedRouter>
    );
  }

  if (!App) {
    App = getRootComponents().mainApp;
  }
  if (!reducers) {
    reducers = getRootComponents().reducers;
  }

  // Object.keys(window.__boring_internals.containers).forEach(container => {
  //   window.__boring_internals.containers[container].preload();
  // });

  preloadReady().then((...args) => {
    console.log('HYDRATING');
    const components = getAppComponents({
      App: App,
      reducers: reducers,
      history: history,
      Router: Router,
      ...extractStateFromDOM(),
    });

    const Container = components.Container;

    ReactDOM.hydrate(
      <Container />,
      document.querySelector('#root')
    );
  });

  return new Promise((resolve, reject) => {
    resolve();
  });
}

/**
 * This is pure sugar / convience
 * to abstract pulling modules
 * from __boring_internals;
 *
 * @return {object}
 */
function getRootComponents() {

  if (isNode) {
    // putting the path prevents webpack from bundling getNodeRootComponents
    const nodeRootComponents = '../../../lib/init-hooks/core-hooks/react/getNodeRootComponents';
    return require(nodeRootComponents)();
  } else {
    __boring_internals.modules.App = __boring_internals.modules.mainApp;
    return {
      decorators: __boring_internals.decorators,
      ...__boring_internals.modules,
    };
  }

};

function subscribeHotReload(fn) {
  try {
    if (!__boring_internals.hot[fn.toString()]) {
      __boring_internals.hot.subscribe(fn);
      __boring_internals.hot[fn.toString()] = true;
      fn();
    }
  } catch (e) {}
}

const toExport = {
  // vendor exports for convience
  React, // backwards compat, remove @ v4
  react: React,
  ReactDOM: ReactDOM, // backwards compat, remove @ v4
  Redux: Redux, // backwards compat, remove @ v4
  redux: Redux,
  ReactRedux: ReactRedux, // backwards compat, remove @ v4
  injecture: injecture,
  isNode,

  // boring components
  renderRedux,
  BoringRouter: BoringRouter,
  MagicallyDeliciousRouter: BoringRouter,
  getRootComponents,
  subscribeHotReload,
  ...decoratorUntil,
};

// TODO: This does NOT work
subscribeHotReload(function() {
  const components = getRootComponents();
  Object.keys(components).forEach(key => {
    toExport[key] = components[key];
  });
});

toExport['react-redux'] = ReactRedux;
toExport['react-dom'] = ReactDOM;

module.exports = toExport;
