const Layout = require('./Layout');
const decorators = require('../../../decorators');
const config = require('boring-config');
const paths = require('paths');
const renderRedux = require('./renderRedux');


module.exports = function reactHook(BoringInjections) {
  const {
    boring,
  } = BoringInjections;

  decorators.router.createEndpointDecorator('reactEntry', 'get');
  const reactEntry = decorators.router.reactEntry;
  const entrypoint = decorators.router.entrypoint;

  decorators.router.reactEntry = function shadowedEntrypoint(options) {

    if (typeof options === 'string') {
      options = {reactRoot: options};
    }

    const reactHandlerPaths = Object.assign({
      clientRoot: config.get('boring.react.clientRoot', '/client/pages'),
      reactRoot: options.reactRoot,
      entrypoint: config.get('boring.react.entrypoint', '/entrypoint.js'),
    }, options);


    const reactDecorator = reactEntry(reactHandlerPaths);
    const entrypointDecorator = entrypoint(
       // __dirname + '/clientEntry.js',
        paths.app_dir
        + reactHandlerPaths.clientRoot
        + '/'
        + reactHandlerPaths.reactRoot
        + reactHandlerPaths.entrypoint
    );

    return function createDecorator(target, field, descriptor) {

      return entrypointDecorator(
          target,
          field,
          reactDecorator(target, field, descriptor)
      );
    };
  };

  boring.before('http::get', function(ctx) {
    if (ctx.get.reactEntry) {
      ctx.res.reactPaths = ctx.get.reactEntry[0];
      ctx.res.renderRedux = renderRedux;
    }

    return Promise.resolve();
  });


  boring.react = {
    Layout,
  };

  return {name: 'react'};
};
