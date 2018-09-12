'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

function ensureSlash(path, needsSlash) {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}

// config after eject: we're in ./config/
module.exports = {
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appIndexJs: resolveApp('src/client/entrypoints/home.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src/client'),
  appNodeModules: resolveApp('node_modules')
};
