// if you copy and paste this, change this to `import ... from 'boringbits/client'`
import {getRootComponents, renderRedux} from './clientEntry';

const {
  mainApp,
  reducers,
  subscribeHotReload,
} = getRootComponents();

function renderApp() {
  renderRedux(mainApp, reducers);
}

subscribeHotReload(renderApp);
