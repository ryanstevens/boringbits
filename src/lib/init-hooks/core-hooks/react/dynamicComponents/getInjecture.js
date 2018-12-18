
import injecture from 'injecture';
window.injectureInited = false;

export default function getInjecture(initStore) {

  window.initInjecture = function initInjecture() {
    if (window.injectureInited) {
    // injecture.instanceStore = {};
    } else {
      window.injectureInited = true;
      injecture.register('boringInitModules', function() {
        return initStore;
      }, {isSingleton: true});
    }

    return injecture;
  };

  return window.initInjecture();
};
