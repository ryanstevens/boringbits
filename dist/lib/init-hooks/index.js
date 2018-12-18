"use strict";

var _paths = _interopRequireDefault(require("paths"));

var _requireInjectAll = _interopRequireDefault(require("require-inject-all"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Hooks do not need to export anything, by default the 
 * name of the hook will be the module name
 */
module.exports = async function initHooks(BoringInjections) {
  const {
    boring
  } = BoringInjections;
  const moduleData = await (0, _requireInjectAll.default)([_paths.default.boring_hooks, _paths.default.server_hooks], BoringInjections);
  return Object.keys(moduleData).reduce(function (prev, key) {
    const hookExport = moduleData[key];
    let name = key;

    if (hookExport && hookExport.name) {
      name = hookExport.name;
    }

    prev[name] = hookExport || {};
    return prev;
  }, {});
};
//# sourceMappingURL=index.js.map