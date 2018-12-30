
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import Layout from './Layout';
import getAppComponents from './AppInitProxy';
import Loadable from 'react-loadable';
import logger from 'boring-logger';
import {getBundles} from 'react-loadable/webpack';


module.exports = function renderRedux(options = {layout: {clientConfig: {}, pageInjections: {}}}) {

  const res = this;
  const req = res.req;

  const context = {};
  const {reactPaths} = res;

  const App = require(reactPaths.mainApp).default;
  const reducers = require(reactPaths.reducers).default;
  const modules = [];
  const stats = require(process.cwd() + '/dist/react-loadable.json');


  function Router(props) {
    return (
      <StaticRouter location={req.url} context={context} props={props}>
        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
          {props.children}
        </Loadable.Capture>
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
    pageInjections: {},
  };

  if (!layout.pageInjections.bodyEndScripts) {
    layout.pageInjections.bodyEndScripts = [];
  }

  const containerHTML = ReactDOMServer.renderToString(<Container />);
  const inlineCSS = getStyleSheets();
  const bundles = getBundles(stats, modules);

  bundles
    .filter(bundle => bundle.file.endsWith('.js'))
    .map(bundle => '/' +bundle.file)
    .forEach(file => layout.pageInjections.bodyEndScripts.push(file));


  res.send('<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
    <Layout
      inlineCSS={inlineCSS}
      locals={res.locals}
      client_config={layout.clientConfig}
      pageInjections={layout.pageInjections}
      containerHTML={containerHTML}
      redux_state={store.getState()}>
    </Layout>
  ));

};
