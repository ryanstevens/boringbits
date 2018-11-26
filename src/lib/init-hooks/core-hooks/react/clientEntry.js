import ReactDOM from 'react-dom';
import React from 'react';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import injecture from 'injecture';
import { ConnectedRouter } from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory';
import getAppComponents from './AppInit';


function renderRedux(App, rootReducer) {

  function Router(props) {
    const history = createBrowserHistory();
    return (
      <ConnectedRouter history={history}>
          {props.children}
      </ConnectedRouter>
    )
  }

  const {Container} = getAppComponents({
    App,
    rootReducer,
    history,
    Router
  });


  ReactDOM.hydrate(
      <Container />
    , document.querySelector('#root'),
  );
}


window.__boring = {
  renderRedux,
  React,
  ReactDOM,
  Redux,
  injecture,
  ReactRedux
};
