import config from 'boring-config';
import fs from 'fs';
import Module from 'module';
import {normalize, extname} from 'path';
import logger from 'boring-logger';
import debounce from 'lodash.debounce';

export const moduleGraph = {};
const timeoutBackoff = [1, 1, 1, 2, 2, 2, 2, 2, 5, 5, 5];


function moduleCache(id) {
  const ext = extname(id);
  id = (ext.length === 0) ? id : id.split(ext).shift();
  if (id.endsWith('/index')) {
    id = id.split('/index').shift();
  }
  if (!moduleGraph[id]) {
    moduleGraph[id] = {
      dependants: [],
      watcher: null,
    };
  }
  return moduleGraph[id];
}

const originalRequire = Module.prototype.require;
const comboCache = {};
Module.prototype.require = function(...args) {

  if (config.get('boring.server.buildModuleGraph', false) === true) {
    const requiredMod = args[0];
    const callerLine = new Error('').stack.split('\n')[3];
    const callerId = callerLine.split(':').shift().split('(').pop().split('at ').pop();
    const callerParts = callerId.split('/');
    callerParts.pop();
    const callerDir = callerParts.join('/');
    const moduleId = requiredMod.indexOf('/') === -1 ? requiredMod :
      requiredMod.charAt(0) === '/' ? requiredMod : normalize(callerDir + '/' + requiredMod);

    const comboKey = moduleId + '::' + callerId;
    if (!comboCache[comboKey]) {
      moduleCache(moduleId).dependants.push(moduleCache(callerId));
      comboCache[comboKey] = true;
    }
  }

  return originalRequire.apply(this, args);
};

function deleteRequireCache(key) {
  if (!key) return;

  logger.debug('deleting require cache key ' + key);
  delete require.cache[key];
  const moduleMeta = moduleCache(key);
  moduleMeta.dependants.forEach(dependant => {
    deleteRequireCache(dependant.cacheKey);
  });
}


if (config.get('boring.server.disable_cache', false) === true) {
  (function check() {
    Object.keys(require.cache).forEach(key => {
      const lowerKey = key.toLowerCase();
      // clearing cache from just /src
      // ensures this is not ran in production
      // and only on our webapp
      if (lowerKey.indexOf(process.cwd().toLowerCase() + '/src') === 0) {
        const moduleMeta = moduleCache(key);
        moduleMeta.cacheKey = key;
        if (!moduleMeta.watcher) {
          moduleMeta.watcher = fs.watch(key, {}, debounce(function() {
            deleteRequireCache(key);
          }), 300, {leading: true});
        }
      }
    });
    timeoutBackoff.push(10);
    setTimeout(check, timeoutBackoff.shift());
  })();
}

export default function(BoringInjections) {
  BoringInjections.moduleGraph = moduleGraph;
};
