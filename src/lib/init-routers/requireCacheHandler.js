import config from 'boring-config';
import fs from 'fs';

const fileCache = {};
const timeoutBackoff = [1, 1, 1, 2, 2, 2, 2, 2, 5, 5, 5];

if (config.get('boring.server.disable_cache', false) === true) {
  (function check() {
    Object.keys(require.cache).forEach(key => {
      const lowerKey = key.toLowerCase();
      // clearing cache from just /src
      // ensures this is not ran in production
      // and only on our webapp
      if (lowerKey.indexOf(process.cwd().toLowerCase() + '/src') === 0) {
        if (!fileCache[key]) {
          fileCache[key] = {
            module: require.cache[key],
          };

          fs.watch(key, {}, function() {
            console.log('resetting', key);
            delete require.cache[key];
          });
        }
      }
    });
    timeoutBackoff.push(10);
    setTimeout(check, timeoutBackoff.shift());
  })();
}
