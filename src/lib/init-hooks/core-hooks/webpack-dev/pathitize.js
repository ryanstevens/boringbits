const paths = require('paths');

module.exports = function(path) {
  if (!path) return null;
  if (path.indexOf(paths.app_dir) === 0) path = path.substring(paths.app_dir.length);
  if (path.charAt(0) === '/') path = path.substring(1);
  return path.split('/').join('-').split('.').shift()
}