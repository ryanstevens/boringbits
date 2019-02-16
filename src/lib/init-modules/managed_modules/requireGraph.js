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
      id,
      requiredBy: [],
      dependencies: [],
      watcher: null,
      stacks: [],
    };
  }
  return moduleGraph[id];
}

const originalRequire = Module.prototype.require;
const comboCache = {};
Module.prototype.require = function(...args) {

  if (config.get('boring.server.buildModuleGraph', false) === true) {
    const requiredMod = args[0];
    const stack = new Error('').stack.split('\n');
    let stackPos = 3;
    for (let i=0; i<stack.length; i++) {
      const frame = stack[i];
      if (frame.indexOf('internal/modules/cjs/helpers.js') > 0) {
        stackPos = i+1;
        break;
      }
    }
    const callerLine = stack[stackPos];
    // the replace at the end of this is a P weird,
    // the reason we have to manually fudge with this
    // frame location is because source maps mess
    // with it. Also, I'm the worst at regex so I
    // didn't even try, but someone please make
    // this a proper regex - RCS
    const callerId = callerLine.split(':').shift().split('(').pop().split('at ').pop().replace('boring/src', 'boring/dist').replace('boringbits/src', 'boringbits/dist');
    const callerParts = callerId.split('/');
    callerParts.pop();
    const callerDir = callerParts.join('/');
    const moduleId = requiredMod.indexOf('/') === -1 ? requiredMod :
      requiredMod.charAt(0) === '/' ? requiredMod : normalize(callerDir + '/' + requiredMod);

    const comboKey = moduleId + '::' + callerId;


    if (!comboCache[comboKey]) {
      const requiredModule = moduleCache(moduleId);
      const requiredByModule = moduleCache(callerId);
      requiredByModule.dependencies.push(requiredModule);
      requiredModule.requiredBy.push(requiredByModule);
      comboCache[comboKey] = stack;
    }
  }

  return originalRequire.apply(this, args);
};

function deleteRequireCache(key, evictUp = true) {
  if (!key) return;

  logger.trace('deleting require cache key ' + key);
  delete require.cache[key];
  const moduleMeta = moduleCache(key);
  if (evictUp) {
    moduleMeta.requiredBy.forEach(dependant => {
      deleteRequireCache(dependant.cacheKey, evictUp);
    });
  } else if (evictUp === false) {
    moduleMeta.dependencies.forEach(dependant => {
      deleteRequireCache(dependant.cacheKey, evictUp);
    });
  }
}

const boringKeys = {};

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
            deleteRequireCache(key, true);
          }), 300, {leading: true});
        }
      }
    });
    timeoutBackoff.push(10);
    setTimeout(check, timeoutBackoff.shift());
  })();
}

export function clearRequireCache(id) {
  deleteRequireCache(id, false);
}

export default function(BoringInjections) {
  BoringInjections.moduleGraph = moduleGraph;

  return {
    clearRequireCache,
  };
};
