
import requireDirectory from 'requireDirectory';

function reduceMods(mods) {
  return mods.reduce((acc, cur) => {
    cur.module.importPath = cur.importPath;
    acc[cur.moduleName] = cur.module;
    return acc;
  }, {});
}

module.exports = function setHandlerPaths(reactHandlerPaths) {

  // actually run `require` on decorators / containers
  reactHandlerPaths.decorators = {
    ...reduceMods(requireDirectory(null, __dirname + '/../../../../client/core-hooks/react/decorators')),
    ...reduceMods(requireDirectory(reactHandlerPaths.app_dir, reactHandlerPaths.decoratorsPath)),
  };

  // it's important reactHandlerPaths.decorators is set BEFORE
  // containers are required because many containers use decorators
  const containers = requireDirectory(reactHandlerPaths.app_dir, reactHandlerPaths.routerContainersPath);
  reactHandlerPaths.containers = reduceMods(containers);

};
