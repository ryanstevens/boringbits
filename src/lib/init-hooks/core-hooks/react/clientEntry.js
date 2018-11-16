

import ReactDOM from 'react-dom';
import React from 'react'


import { ConnectedRouter } from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory';

const getAppComponents = require('./AppInit').default;


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
};
