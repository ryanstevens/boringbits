
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

const path = require('path');
const paths = require('paths');
const config = require('boring-config');
const Layout = require('./Layout');


module.exports = function renderRedux(options = { layout: { clientConfig: {}, headScripts: []}}) {

  const res = this;
  const req = res.req;

  const context = {};
  const appInitPath = paths.app_dir
    + res.reactPaths.clientRoot
    + '/'
    + res.reactPaths.reactRoot
    + config.get('boring.react.reduxComponents', '/AppInit.js')

  const getAppComponents = require(path.normalize(appInitPath)).default;
  const  { Container, getStyleSheets, store }  = getAppComponents({Router: (props) => {
    return (
      <StaticRouter location={req.url} context={context} props={props}>
        {props.children}
      </StaticRouter>
    )
  }});

  res.send('<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
    <Layout
      getStyleSheets={getStyleSheets}
      locals={res.locals}
      client_config={options.layout.clientConfig}
      headScripts={options.layout.headScripts}
      redux_state={store.getState()}>
      <Container />
    </Layout>
  ))
}