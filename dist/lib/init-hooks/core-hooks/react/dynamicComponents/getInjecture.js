"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getInjecture;

var _injecture = _interopRequireDefault(require("injecture"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.injectureInited = false;

function getInjecture(initStore) {
  window.initInjecture = function initInjecture() {
    if (window.injectureInited) {// injecture.instanceStore = {};
    } else {
      window.injectureInited = true;

      _injecture.default.register('boringInitModules', function () {
        return initStore;
      }, {
        isSingleton: true
      });
    }

    return _injecture.default;
  };

  return window.initInjecture();
}

;
//# sourceMappingURL=getInjecture.js.map