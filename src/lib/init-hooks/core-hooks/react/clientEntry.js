import ReactDOM from 'react-dom';
import React from 'react';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import injecture from 'injecture';
import { ConnectedRouter } from 'connected-react-router'
import createBrowserHistory from 'history/createBrowserHistory';
import getAppComponents from './AppInit';


function renderRedux(App, reducers) {


  const history = createBrowserHistory();
  function Router(props) {
    return (
      <ConnectedRouter history={history}>
          {props.children}
      </ConnectedRouter>
    )
  }

  const {Container} = getAppComponents({
    App,
    reducers,
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
