"use strict";

var _clientEntry = require("./clientEntry");

function renderApp() {
  const {
    mainApp,
    reducers
  } = __boring_internals.modules;
  (0, _clientEntry.renderRedux)(mainApp, reducers);
}

if (!__boring_internals.hot.entrypointSubscribed) {
  __boring_internals.hot.subscribe(function () {
    renderApp();
  });

  __boring_internals.hot.entrypointSubscribed = true;
  renderApp();
}
//# sourceMappingURL=defaultEntrypoint.js.map