
import paths from 'paths';
import requireInject from 'require-inject-all';

import {promisify} from 'util';
import glob from 'glob';

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


  const results = await Promise.all([paths.boring_app_dir, paths.app_dir].map(path => {
    return syncGlob('**/managed_modules/**/*.js', {cwd: path}).then(files => {
      return files.map(file => {
        return path + '/' + file;
      });
    });
  }));

  const uniqueArray = results.reduce((acc, arr) => {
    // combine arrays
    return acc.concat(arr);
  }, []).reduce(function(acc, item) {
    // dedupe
    if (acc.indexOf(item)<0) acc.push(item);
    return acc;
  }, []).filter(file => file.indexOf('/test/') < 0);

  return await Promise.all(uniqueArray.map(file => {
    logger.info('Registering managed module: ' + file);
    const moduleExport = require(file);
    const fn = moduleExport.default ? moduleExport.default : moduleExport;
    return fn(BoringInjections);
  }));

};
