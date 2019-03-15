
import paths from 'paths';

import {promisify} from 'util';
import glob from 'glob';
import {basename, extname} from 'path';

const syncGlob = promisify(glob);


// eslint-disable-next-line valid-jsdoc
/**
   * Hooks do not need to export anything, by default the
   * name of the hook will be the module name
   */
module.exports = async function initModules(BoringInjections) {

  const {
    boring,
    logger,
  } = BoringInjections;

  const dirs = BoringInjections.plugins.splicePlugins('', [paths.boring_app_dir, paths.app_dir]);

  const results = await Promise.all(dirs.map(path => {
    return syncGlob('**/managed_modules/**/*.{js,ts}', {cwd: path}).then(files => {
      return files.map(file => {
        return path + '/' + file;
      });
    });
  }));

  const uniqueArray = results.reduce((acc, arr) => acc.concat(arr), [])
    .reduce(function(acc, item) {
      // dedupe
      if (acc.indexOf(item)<0) acc.push(item);
      return acc;
    }, [])
    .filter(file => file.indexOf('/test/') < 0)
    .filter(file => file.indexOf('/__test__/') < 0);

  const modulesArr = await Promise.all(uniqueArray.map(file => {
    logger.info('Registering managed module: ' + file);
    const moduleExport = require(file);
    const name = basename(file, extname(file));
    const fn = moduleExport.default ? moduleExport.default : moduleExport;
    return new Promise((resolve, reject) => {
      const ret = fn(BoringInjections);
      if (ret instanceof Promise) {
        ret.then((fromPromise) => {
          resolve({
            name,
            val: fromPromise,
          });
        }).catch(reject);
      } else {
        resolve({
          name,
          val: ret,
        });
      }
    });
  }));

  return modulesArr.reduce((acc, mod) => {
    acc[mod.name] = mod.val;
    return acc;
  }, {});

};
