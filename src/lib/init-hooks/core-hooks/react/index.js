
const Layout = require('./Layout');
const decorators = require('../../../decorators');
const config = require('boring-config');
const paths = require('paths');

module.exports = function reactHook(BoringInjections) {
  const {
    boring,
  } = BoringInjections;

  const entrypoint = decorators.router.entrypoint;
  decorators.router.reactEntry = function shadowedEntrypoint(...args) {
    const newArgs = args.map(arg => {
      return paths.app_dir
        + config.get('boring.react.clientRoot', '/client/pages')
        + '/'
        + arg
        + config.get('boring.react.defaultEntrypoint', '/entrypoint.js');
    });
    return entrypoint(...newArgs);
  };

  boring.react = {
    Layout,
  };

  return {name: 'react'};
};
