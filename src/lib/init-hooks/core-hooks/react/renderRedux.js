
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import Layout from './Layout';
import getAppComponents from './AppInit';

module.exports = function renderRedux(options = { layout: { clientConfig: {}, pageInjections: {}}}) {

  const res = this;
  const req = res.req;

  const context = {};
  const {reactPaths} = res;

  const App = require(reactPaths.mainApp).default;
  const reducers = require(reactPaths.reducers).default;

  function Router(props) {
    return (
      <StaticRouter location={req.url} context={context} props={props}>
        {props.children}
      </StaticRouter>
    );
  }

  const {Container, getStyleSheets, store} = getAppComponents({
    App,
    Router,
    reducers,
  });

  const layout = options.layout || {
    clientConfig: {},
    pageInjections: {}
  };

  res.send('<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
      <Layout
        getStyleSheets={getStyleSheets}
        locals={res.locals}
        client_config={layout.clientConfig}
        pageInjections={layout.pageInjections}
        redux_state={store.getState()}>
        <Container />
      </Layout>
  ))
}