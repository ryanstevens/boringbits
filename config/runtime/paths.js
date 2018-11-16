/**
 * This is HEAVILY inspired by the patterns found
 * in the paths module ejected from react-scripts (CRA)
 */

const config = require('./boring-config');
const path = require('path');

const proj_dir = path.normalize(config.get('boring.paths.proj_dir', process.cwd()))
const base_app_path_key = 'boring.paths.base_app_path'

const base_app_path = path.normalize(config.get(base_app_path_key, 'dist'))
const boring_dir = path.normalize(__dirname + '/../../')
const boring_app_path = path.normalize(config.get('boring.paths.boring_app_path', 'dist'))


function getProjPath(key, defaultVal) {
  return path.normalize(proj_dir +'/'+ config.get(key, defaultVal));
}

function getAppDirPath(key, defaultVal) {
  return path.normalize(getProjPath(base_app_path_key, base_app_path) + '/'+ config.get(key , defaultVal));
}

function getBoringPath(key, defaultVal) {
  return path.normalize(boring_dir + '/' + config.get(key, defaultVal));
}



module.exports = {

  proj_dir,
  boring_dir,
  base_app_path,

  app_build: getProjPath('boring.paths.app_build', 'build'),
  app_dist: getProjPath('boring.paths.app_dist', 'dist'),
  app_config: getProjPath('boring.paths.app_config', 'config'),
  app_src: getProjPath('boring.paths.app_src', 'src'),
  app_node_modules: getProjPath('boring.paths.node_modules', 'node_modules'),
  app_package_json: getProjPath('boring.paths.package_json', 'package.json'),
  app_dir: getProjPath(base_app_path_key, base_app_path),

  server_routers: getAppDirPath('boring.paths.server_routers', '/server/routers'),
  server_middleware: getAppDirPath('boring.paths.server_middleware', '/server/middleware'),
  server_hooks: getAppDirPath('boring.paths.server_hooks', '/server/hooks'),

  boring_routers: getBoringPath('boring.paths.boring_routers', `/${boring_app_path}/lib/init-routers/core-routers`),
  boring_middleware: getBoringPath('boring.paths.boring_middleware', `/${boring_app_path}/lib/init-middleware/core-middleware`),
  boring_hooks: getBoringPath('boring.paths.boring_hooks', `/${boring_app_path}/lib/init-hooks/core-hooks`),

  boring_webpack_dev_config: getBoringPath('boring.paths.boring_webpack_dev_config', '/config/runtime/webpack.config.dev.js'),
  boring_webpack_prod_config: getBoringPath('boring.paths.boring_webpack_prod_config', '/config/runtime/webpack.config.prod.js'),

  asset_manifest: getProjPath('boring.paths.asset_manifest', '/build/asset-manifest.json')
}