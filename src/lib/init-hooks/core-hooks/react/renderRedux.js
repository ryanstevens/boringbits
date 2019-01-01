
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import Layout from './Layout';
import getAppComponents from './AppInitProxy';
import Loadable from 'react-loadable';
import {getBundles} from 'react-loadable/webpack';
import {frontloadServerRender, Frontload} from 'react-frontload';


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
        <Frontload isServer={true}>
          <Loadable.Capture report={moduleName => modules.push(moduleName)}>
            {props.children}
          </Loadable.Capture>
        </Frontload>
      </StaticRouter>
    );
  }

  const layout = options.layout || {
    clientConfig: {},
    pageInjections: {},
  };

  if (!layout.pageInjections.bodyEndScripts) {
    layout.pageInjections.bodyEndScripts = [];
  }
  if (!layout.pageInjections.headLinks) {
    layout.pageInjections.headLinks = [];
  }

  let getStyleSheets;
  let store;

  return frontloadServerRender((dryRun) => {

    const components = getAppComponents({
      App,
      Router,
      reducers,
    });

    if (!dryRun) {
      getStyleSheets = components.getStyleSheets;
      store = components.store;
    }

    return ReactDOMServer.renderToString(<components.Container />);
  }).then((containerHTML) => {

    // const containerHTML = ReactDOMServer.renderToString(<Container />);
    const bundles = getBundles(stats, modules);

    bundles
      .filter(bundle => bundle.file.endsWith('.js'))
      .map(bundle => '/' +bundle.file)
      .forEach(file => {
        if (layout.pageInjections.bodyEndScripts.indexOf(file) < 0) {
          layout.pageInjections.bodyEndScripts.push(file);
        }
      });

    bundles
      .filter(bundle => bundle.file.endsWith('.css'))
      .map(bundle => '/' +bundle.file)
      .forEach(file => {
        if (layout.pageInjections.headLinks.indexOf(file) < 0) {
          layout.pageInjections.headLinks.push(file);
        }
      });

    res.send('<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
      <Layout
        inlineCSS={getStyleSheets()}
        locals={res.locals}
        client_config={layout.clientConfig}
        pageInjections={layout.pageInjections}
        containerHTML={containerHTML}
        redux_state={store.getState()}>
      </Layout>
    ));

  });

};

