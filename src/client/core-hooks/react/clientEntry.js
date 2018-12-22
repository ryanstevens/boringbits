import ReactDOM from 'react-dom';
import React from 'react';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import injecture from 'injecture';
import {ConnectedRouter} from 'connected-react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import getAppComponents from './AppInit';
import BoringRouter from './BoringRouter';

function renderRedux(App, reducers) {

  const history = createBrowserHistory();
  function Router(props) {
    return (
      <ConnectedRouter history={history}>
        {props.children}
      </ConnectedRouter>
    );
  }

  const components = getAppComponents({
    App: App,
    reducers: reducers,
    history: history,
    Router: Router,
  });

  const Container = components.Container;


  ReactDOM.hydrate(
    <Container />,
    document.querySelector('#root')
  );

  return components;
}

const toExport = {
  renderRedux: renderRedux,
  React: React, // backwards compat, remove @ v4
  react: React,
  ReactDOM: ReactDOM, // backwards compat, remove @ v4
  Redux: Redux, // backwards compat, remove @ v4
  redux: Redux,
  injecture: injecture,
  ReactRedux: ReactRedux, // backwards compat, remove @ v4
  BoringRouter: BoringRouter,
  MagicallyDeliciousRouter: BoringRouter,
};

toExport['react-redux'] = ReactRedux;
toExport['react-dom'] = ReactDOM;

module.exports = toExport;
