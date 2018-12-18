"use strict";

var _paths = _interopRequireDefault(require("paths"));

var _requireInjectAll = _interopRequireDefault(require("require-inject-all"));

var _util = require("util");

var _glob = _interopRequireDefault(require("glob"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const syncGlob = (0, _util.promisify)(_glob.default);
/**
 * Hooks do not need to export anything, by default the
 * name of the hook will be the module name
 */

module.exports = async function initModules(BoringInjections) {
  const {
    boring,
    logger
  } = BoringInjections;
  const results = await Promise.all([_paths.default.boring_app_dir, _paths.default.app_dir].map(path => {
    return syncGlob('**/managed_modules/**/*.js', {
      cwd: path
    }).then(files => {
      return files.map(file => {
        return path + '/' + file;
      });
    });
  }));
  const uniqueArray = results.reduce((acc, arr) => {
    // combine arrays 
    return acc.concat(arr);
  }, []).reduce(function (acc, item) {
    // dedupe
    if (acc.indexOf(item) < 0) acc.push(item);
    return acc;
  }, []);
  return await Promise.all(uniqueArray.map(file => {
    logger.info('Registering managed module: ' + file);
    return require(file)(BoringInjections);
  }));
};
//# sourceMappingURL=index.js.map