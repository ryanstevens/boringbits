import ReactDOM from 'react-dom';
import React from 'react';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import injecture from 'injecture';
import { ConnectedRouter } from 'connected-react-router'
import createBrowserHistory from 'history/createBrowserHistory';
import getAppComponents from './AppInit';


function renderRedux(App, reducers) {


  var history = createBrowserHistory();
  function Router(props) {
    return (
      <ConnectedRouter history={history}>
          {props.children}
      </ConnectedRouter>
    )
  }

  var components = getAppComponents({
    App: App,
    reducers:reducers,
    history: history,
    Router: Router
  });

  var Container = components.Container;


  ReactDOM.hydrate(
      <Container />
    , document.querySelector('#root'),
  );

  return components;
}


module.exports = {
  renderRedux: renderRedux,
  React: React,
  ReactDOM: ReactDOM,
  Redux: Redux,
  injecture: injecture,
  ReactRedux: ReactRedux
};
