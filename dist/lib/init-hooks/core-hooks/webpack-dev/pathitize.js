"use strict";

const paths = require('paths');

module.exports = function pathatize(pathArr) {
  if (!pathArr) return null;

  if (!(pathArr instanceof Array)) {
    pathArr = [pathArr];
  }

  const standardEntryPath = 'src-client-pages-';
  return pathArr.map(path => {
    if (path.indexOf(paths.app_dir) === 0) {
      path = path.substring(paths.app_dir.length);
    }

    if (path.indexOf(paths.boring_dir) === 0) {
      path = path.substring(paths.boring_dir.length);
    }

    if (path.charAt(0) === '/') path = path.substring(1);
    path = path.split('/').join('-').split('.').shift(); // the following are some harded coded things
    // to strip out of the path that are
    // set by boring internals.  Maybe later
    // we can find a more elegant solution

    if (path === 'dist-lib-init-hooks-core-hooks-react-clientEntry') {
      path = 'entry';
    }

    if (path.indexOf(standardEntryPath) === 0) {
      path = path.substring(standardEntryPath.length);
    }

    if (path.endsWith('-entrypoint')) {
      path = path.split('-entrypoint').shift();
    }

    return path;
  }).join('_');
};
//# sourceMappingURL=pathitize.js.map