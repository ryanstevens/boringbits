/* eslint-disable indent */
import config from 'boring-config';
import fs from 'fs';
import Module from 'module';
import {normalize, extname} from 'path';
import logger from 'boring-logger';
import debounce from 'lodash.debounce';

export const moduleGraph = {};
const timeoutBackoff = [1, 1, 1, 2, 2, 2, 2, 2, 5, 5, 5];
const pathsToClear = [];

function moduleCache(originalId, path) {
  const ext = extname(originalId);
  let id = (ext.length === 0) ? originalId : originalId.split(ext).shift();
  if (id.endsWith('/index')) {
    id = id.split('/index').shift();
  }
  if (!moduleGraph[id]) {
    moduleGraph[id] = {
      id,
      originalId,
      path,
      requiredBy: [],
      dependencies: [],
      watcher: null,
      stacks: [],
    };
  }
  if (path) moduleGraph[id].path = path;
  return moduleGraph[id];
}

const originalRequire = Module.prototype.require;
const comboCache = {};
Module.prototype.require = function(...args) {

  if (config.get('boring.server.buildModuleGraph', false) === true) {
    const requiredMod = args[0];
    // const stack = new Error('').stack.split('\n');
    // let stackPos = 3;
    // for (let i=0; i<stack.length; i++) {
    //   const frame = stack[i];
    //   if (frame.indexOf('internal/modules/cjs/helpers.js') > 0) {
    //     stackPos = i+1;
    //     break;
    //   }
    // }
    // const callerLine = stack[stackPos];
    // the replace at the end of this is a P weird,
    // the reason we have to manually fudge with this
    // frame location is because source maps mess
    // with it. Also, I'm the worst at regex so I
    // didn't even try, but someone please make
    // this a proper regex - RCS
    // const callerId_orig = callerLine.split(':').shift().split('(').pop().split('at ').pop().replace('boring/src', 'boring/dist').replace('boringbits/src', 'boringbits/dist');
    const callerId = this.id.replace('boring/src', 'boring/dist').replace('boringbits/src', 'boringbits/dist');

    const callerParts = callerId.split('/');
    callerParts.pop();
    const callerDir = callerParts.join('/');

    const moduleId = requiredMod.indexOf('modules/') === 0 ? process.cwd() + '/src/' + requiredMod :
                     requiredMod.indexOf('/') === -1 ? requiredMod :
                     requiredMod.charAt(0) === '/' ? requiredMod :
                     (requiredMod.indexOf('../') === 0 || requiredMod.indexOf('./') === 0) ? normalize(callerDir + '/' + requiredMod) :
                        requiredMod;

    const comboKey = moduleId + '::' + callerId;

    if (!comboCache[comboKey]) {
      const requiredModule = moduleCache(moduleId);
      const requiredByModule = moduleCache(callerId, this.id);
      requiredByModule.dependencies.push(requiredModule);
      requiredModule.requiredBy.push(requiredByModule);
      comboCache[comboKey] = comboKey;
    }
  }

  return originalRequire.apply(this, args);
};

function deleteRequireCache(key, evictUp = true) {
  if (!key) return;

  if (require.cache[key]) {
    logger.trace('deleting require cache key ' + key);
  } else {
    logger.trace('no key found to delete from cache ' + key);
  }
  delete require.cache[key];
  const moduleMeta = moduleCache(key);
  if (evictUp) {
    moduleMeta.requiredBy.forEach(dependant => {
      deleteRequireCache(dependant.id, evictUp);
    });
  } else if (evictUp === false) {
    moduleMeta.dependencies.forEach(dependant => {
      const dependantKey = dependant.path || dependant.originalId;
      if (pathsToClear.some(path => dependantKey.toLowerCase().indexOf(path.toLowerCase()) === 0)) {
        deleteRequireCache(dependantKey, evictUp);
      }
    });
  }
}


if (config.get('boring.server.disable_cache', false) === true) {
  (function check() {
    Object.keys(require.cache).forEach(key => {
      const lowerKey = key.toLowerCase();

      if (pathsToClear.some(path => lowerKey.indexOf(path.toLowerCase()) === 0)) {
        const moduleMeta = moduleCache(key);
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

function addPathToClearCache(path) {
  pathsToClear.push(path);
}


// clearing cache from just /src
// ensures this is not ran in production
// and only on our webapp
addPathToClearCache(process.cwd().toLowerCase() + '/src');
addPathToClearCache(process.cwd().toLowerCase() + '/dist');

export default function(BoringInjections) {
  BoringInjections.moduleGraph = moduleGraph;

  return {
    clearRequireCache,
    addPathToClearCache,
  };
};
