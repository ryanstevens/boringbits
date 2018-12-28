
import paths from 'paths';
import requireInject from 'require-inject-all';

/**
   * Hooks do not need to export anything, by default the
   * name of the hook will be the module name
   */
module.exports = async function initHooks(BoringInjections) {

  const {
    boring,
  } = BoringInjections;


  const moduleData = await requireInject([paths.boring_hooks, paths.server_hooks], BoringInjections);

  return Object.keys(moduleData).reduce(function(prev, key) {
    const hookExport = moduleData[key];
    let name = key;

    if (hookExport && hookExport.name) {
      name = hookExport.name;
    }

    prev[name] = hookExport || {};
    return prev;
  }, {});

};
