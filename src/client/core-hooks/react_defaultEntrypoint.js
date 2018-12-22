
import {renderRedux} from './react-clientEntry';

function renderApp() {

  const {
    mainApp,
    reducers,
  } = __boring_internals.modules;

  renderRedux(mainApp, reducers);
}

if (!__boring_internals.hot.entrypointSubscribed) {
  __boring_internals.hot.subscribe(renderApp);
  __boring_internals.hot.entrypointSubscribed = true;
  renderApp();
}

