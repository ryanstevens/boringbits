// if you copy and paste this, change this to `import ... from 'boringbits/client'`
import {getRootComponents, renderRedux, subscribeHotReload} from './clientEntry';

function renderApp() {

  const {
    mainApp,
    reducers,
  } = getRootComponents();

  renderRedux(mainApp, reducers);
}

subscribeHotReload(renderApp);
