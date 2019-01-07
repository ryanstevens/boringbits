import logger from 'boring-logger';
import fs from 'fs-extra';

function reduceMods(mods) {
  return mods.reduce((acc, cur) => {
    cur.module.importPath = cur.importPath;
    acc[cur.moduleName] = cur.module;
    return acc;
  }, {});
}

function requireDirectory(appDir, directoryPath) {
  const dirToRead = appDir +'/'+ directoryPath;
  try {
    if (!fs.existsSync(dirToRead)) return [];
    return fs.readdirSync(dirToRead).map(function(file) {
      if (file.endsWith('.map')) return null;
      const fileParts = file.split('.');
      if (fileParts.length > 1) fileParts.pop();
      const moduleName = fileParts.join('.'); // don't worry about what type of extension
      const mod = require(dirToRead + '/' + moduleName);
      return {
        moduleName,
        module: (mod.default) ? mod.default : mod,
        importPath: directoryPath + '/' + moduleName,
      };
    }).filter(Boolean);

  } catch (e) {
    logger.error(e, 'Problem requiring directory');
    return [];
  }
}

module.exports = function setHandlerPaths(reactHandlerPaths) {

  // actually run `require` on decorators / containers
  const decorators = requireDirectory(reactHandlerPaths.app_dir, reactHandlerPaths.decoratorsPath);
  reactHandlerPaths.decorators = reduceMods(decorators);

  // it's important reactHandlerPaths.decorators is set BEFORE
  // containers are required because many containers use decorators
  const containers = requireDirectory(reactHandlerPaths.app_dir, reactHandlerPaths.routerContainersPath);
  reactHandlerPaths.containers = reduceMods(containers);

};
