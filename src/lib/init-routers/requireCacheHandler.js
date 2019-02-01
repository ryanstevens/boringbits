import config from 'boring-config';


export function clearRequireCache() {
  if (config.get('boring.server.disable_cache', false) === true) {
    Object.keys(require.cache).forEach(key => {
      const lowerKey = key.toLowerCase();
      // clearing cache from just /src
      // ensures this is not ran in production
      // and only on our webapp
      if (lowerKey.indexOf(process.cwd().toLowerCase() + '/src') === 0 ||
        lowerKey.indexOf('requirehandlerpaths') >=0) {
        delete require.cache[key];
      }
    });
  }
};

