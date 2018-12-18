"use strict";

var _paths = _interopRequireDefault(require("paths"));

var _requireInjectAll = _interopRequireDefault(require("require-inject-all"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function initMiddleware(BoringInjections) {
  const {
    boring
  } = BoringInjections;
  const moduleData = await (0, _requireInjectAll.default)([_paths.default.boring_middleware, _paths.default.server_middleware], boring);
  return Object.keys(moduleData).reduce(function (prev, key) {
    const middlewareExport = moduleData[key];
    let func = middlewareExport;
    let name = key;

    if (typeof middlewareExport != 'function') {
      name = middlewareExport.name;
      func = middlewareExport.middleware || middlewareExport.func || middlewareExport.run;
    }

    prev[name] = func; //    boring.add_middleware(name, func);

    return prev;
  }, {});
};
//# sourceMappingURL=index.js.map