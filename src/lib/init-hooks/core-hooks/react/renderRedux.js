
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

const path = require('path');
const paths = require('paths');
const config = require('boring-config');
const Layout = require('./Layout');


module.exports = function renderRedux(options = { layout: { clientConfig: {}, pageInjections: {}}}) {

  const res = this;
  const req = res.req;

  const context = {};

  const App = require(paths.app_dir
    + res.reactPaths.clientRoot
    + '/'
    + res.reactPaths.reactRoot
    + config.get('boring.react.mainApp', '/App.js')).default

  const rootReducer = require(paths.app_dir
    + res.reactPaths.clientRoot
    + '/'
    + res.reactPaths.reactRoot
    + config.get('boring.react.reducers', '/reducers')).default;

  function Router(props) {
    return (
      <StaticRouter location={req.url} context={context} props={props}>
        {props.children}
      </StaticRouter>
    )
  }

  const dependencies = {
    App,
    Router,
    rootReducer
  }

  const getAppComponents = require('./AppInit').default;
  const  { Container, getStyleSheets, store }  = getAppComponents(dependencies);

  res.send('<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
    <Layout
      getStyleSheets={getStyleSheets}
      locals={res.locals}
      client_config={options.layout.clientConfig}
      pageInjections={options.layout.pageInjections}
      redux_state={store.getState()}>
      <Container />
    </Layout>
  ))
}