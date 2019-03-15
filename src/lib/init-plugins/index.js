import fs from 'fs';

module.exports = async function initPlugins(BoringInjections) {

  const {config, logger} = BoringInjections;
  const pluginConfig = config.get('boring.plugins', {});
  // normalize input
  const pluginMeta = Object.keys(pluginConfig).reduce((acc, name) => {
    const plugin = pluginConfig[name];
    if (!plugin.resolve) {
      acc[name] = {
        resolve: name,
        args: plugin,
      };
    } else {
      acc[name] = plugin;
    }
    return acc;
  }, {});

  const plugins = Object.keys(pluginMeta).reduce((acc, pluginName) => {
    logger.info('Registering plugin ' + pluginName);
    const plugin = pluginMeta[pluginName];
    const pluginModule = (typeof plugin.resolve === 'string') ? require(plugin.resolve) : plugin;
    acc[pluginName] = pluginModule(BoringInjections);
    return acc;
  }, {});

  const sortedPlugins = Object
    .keys(plugins)
    .sort(function(name1, name2) {
      const sort1 = plugins[name1].runOrder || 100;
      const sort2 = plugins[name2].runOrder || 100;
      if (sort1<sort2) return -1;
      else if (sort1 === sort2) return 0;
      else return 1;
    });

  function mapPlugins(fn) {
    return sortedPlugins.map(fn);
  }

  function splicePlugins(dirname, dirsToSplice = []) {
    const pluginDirs = mapPlugins((pluginName => {
      const plugin = plugins[pluginName];
      const path = plugin.baseDir + '/' + dirname;
      if (fs.existsSync(path)) {
        return path;
      } else return null;
    })).filter(Boolean);

    return [
      dirsToSplice.shift(),
      ...pluginDirs,
      ...dirsToSplice,
    ].filter(Boolean);
  }

  (await Promise.all(
    mapPlugins(pluginName => {
      return plugins[pluginName]
        .run(pluginMeta[pluginName].args)
        .then(result => {
          return {
            pluginName,
            result,
          };
        });
    })
  )).forEach(retVal => {
    plugins[retVal.pluginName].value = retVal.result || {};
  });

  return {
    active: plugins,
    map: mapPlugins,
    splicePlugins,
  };
};
