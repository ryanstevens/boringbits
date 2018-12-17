const Layout = require('./Layout');
const decorators = require('../../../decorators');
const config = require('boring-config');
const paths = require('paths');
const renderRedux = require('./renderRedux');
const dynamicComponents = require('./dynamicComponents').default;


module.exports = function reactHook(BoringInjections) {
  const {
    boring,
  } = BoringInjections;

  decorators.router.createEndpointDecorator('reactEntry', 'get');

  const shadowedReactEntry = decorators.router.reactEntry;
  decorators.router.reactEntry = function shadowedEntrypoint(options = {}) {

    if (typeof options === 'string') {
      options = {reactRoot: options};
    }

    return function createDecorator(target, field, descriptor) {

      if (!options.reactRoot) {
        // if there is nothing passed into the decorator
        // assume the the function name that is decorating
        // is the name of the page in client.
        //
        // @reactEntry()
        // helloworld(req, res) { res.renderRedux(); }
        //
        // Would end up mapping to {app_root}/client/pages/helloworld/entrypoint.js
        options.reactRoot = field.toLowerCase();
      }

      // this needs to live outside of the spread
      // because it is used to create baseAppPath
      const clientRoot = options.clientRoot || config.get('boring.react.clientRoot', '/client/pages');

      options = {
        clientRoot,
        baseAppPath: paths.app_dir + clientRoot + '/' + options.reactRoot,
        entrypointFile: config.get('boring.react.entrypoint', 'entrypoint'),
        routeContainersDirectory: config.get('boring.react.routerContainersDirectory', 'containers'),
        // not quite sure if we are gonna require this for people.
        mainAppFile: config.get('boring.react.mainApp', 'App.js'),
        reducersFile: config.get('boring.react.reducers', 'reducers'),
        ...options,
      };

      const reactHandlerPaths = {
        // This grouping are absolute filepaths
        // meant to be required / imported.
        // These are the `defaults` for borings
        // react / redux conventions
        entrypoint: options.baseAppPath + '/' + options.entrypointFile,
        routerContainers: options.baseAppPath + '/' + options.routeContainersDirectory,
        mainApp: options.baseAppPath + '/'+ options.mainAppFile,
        reducers: options.baseAppPath + '/'+ options.reducersFile,
        ...options,
      };

      const [beforeEntry, afterEntry] = dynamicComponents(reactHandlerPaths, options);

      const entrypointPaths = [
        beforeEntry,
        reactHandlerPaths.entrypoint,
        afterEntry,
      ];

      return decorators.router.entrypoint(...entrypointPaths)(
          target,
          field,
          shadowedReactEntry(reactHandlerPaths)(target, field, descriptor)
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
