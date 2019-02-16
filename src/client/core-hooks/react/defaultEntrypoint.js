// if you copy and paste this, change this to `import ... from 'boringbits/client'`
import {getRootComponents, renderRedux, subscribeHotReload} from './clientEntry';
import React from 'react';

function renderApp() {

  const {
    appTheme,
    mainApp,
    reducers,
    Router,
    appDecorator,
  } = getRootComponents();

  const App = mainApp;
  function ThemeMainApp() {
    return (
      <App theme={appTheme()} />
    );
  }

  renderRedux(appDecorator(ThemeMainApp), reducers, Router);
}

subscribeHotReload(renderApp);
