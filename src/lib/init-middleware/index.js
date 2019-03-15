
import paths from 'paths';
import requireInject from 'require-inject-all';

module.exports = async function initMiddleware(BoringInjections) {

  const dirs = BoringInjections.plugins.splicePlugins('middleware', [paths.boring_middleware, paths.server_middleware]);
  const moduleData = await requireInject(dirs, BoringInjections);

  return Object.keys(moduleData).reduce(function(prev, key) {
    const middlewareExport = moduleData[key];
    let func = middlewareExport;
    let name = key;

    if (typeof middlewareExport != 'function') {
      name = middlewareExport.name;
      func = middlewareExport.middleware || middlewareExport.func || middlewareExport.run;
    }

    prev[name] = func;
    //    boring.add_middleware(name, func);
    return prev;
  }, {});

};
