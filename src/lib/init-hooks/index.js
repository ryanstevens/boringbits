
import paths from 'paths';
import requireInject from 'require-inject-all';

// eslint-disable-next-line valid-jsdoc
/**
   * Hooks do not need to export anything, by default the
   * name of the hook will be the module name
   */
module.exports = async function initHooks(BoringInjections) {

  const {
    boring,
  } = BoringInjections;

  const dirs = BoringInjections.plugins.splicePlugins('hooks', [paths.boring_hooks, paths.server_hooks]);
  const moduleData = await requireInject(dirs, BoringInjections);

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
