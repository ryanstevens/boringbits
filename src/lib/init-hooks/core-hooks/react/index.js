const Layout = require('./Layout');
const decorators = require('../../../decorators');
const config = require('boring-config');
const paths = require('paths');
const renderRedux = require('./renderRedux');
const dynamicComponents = require('./dynamicComponents').default;
const fs = require('fs');

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
      const clientRoot = options.clientRoot || config.get('boring.react.clientRoot', 'client/pages');

      options = {
        ...paths,
        clientRoot,
        baseAppPath: clientRoot + '/' + options.reactRoot,
        entrypointFile: config.get('boring.react.entrypoint', 'entrypoint'),
        routeContainersDirectory: config.get('boring.react.routerContainersDirectory', 'containers'),
        // not quite sure if we are gonna require this for people.
        mainAppFile: config.get('boring.react.mainApp', 'App.js'),
        reducersFile: config.get('boring.react.reducers', 'reducers'),
        ...options,
      };

      const reactHandlerPaths = {
        // This grouping are filepaths
        // relative to the application
        // meant to be required / imported.
        // These are the `defaults` for borings
        // react / redux conventions
        entrypoint: options.baseAppPath + '/' + options.entrypointFile,
        mainApp: options.baseAppPath + '/'+ options.mainAppFile,
        reducers: options.baseAppPath + '/'+ options.reducersFile,
        // this one is a little special, we want to
        // make sure it's relative to the app_dir
        // but not having the app_dir in it's path
        routerContainers: options.baseAppPath + '/' + options.routeContainersDirectory,
        ...options,
      };

      reactHandlerPaths.containers = getContainers(reactHandlerPaths);

      const modulesToRequire = {};
      const entryPointPath = options.app_dir +'/'+reactHandlerPaths.entrypoint;
      
      // check to make sure entrypoint is real
      if (!fs.existsSync(entryPointPath + '.js') &&
        !fs.existsSync(entryPointPath + '.jsx') &&
        !fs.existsSync(entryPointPath + '.ts') &&
        !fs.existsSync(entryPointPath + '.tsx')) {
        reactHandlerPaths.entrypoint = __dirname + '/defaultEntrypoint.js';
        modulesToRequire['reducers'] = reactHandlerPaths.reducers;
        modulesToRequire['mainApp'] = reactHandlerPaths.mainApp;
      }

      const [beforeEntry, afterEntry] = dynamicComponents(reactHandlerPaths, modulesToRequire);

      const entrypointPaths = [
        beforeEntry,
        reactHandlerPaths.entrypoint,
        afterEntry,
      ].filter(Boolean);

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


function getContainers(reactHandlerPaths) {
  const containersDirPath = reactHandlerPaths.app_dir +'/'+ reactHandlerPaths.routerContainers;
  try {
    return fs.readdirSync(containersDirPath).map(function(file) {
      if (file.endsWith('.map')) return null;
      const moduleName = file.split('.').shift(); // don't worry about what type of extension
      const container = require(containersDirPath + '/' + moduleName).default;
      return {
        path: container.path,
        container,
        moduleName,
        importPath: reactHandlerPaths.routerContainers + '/' + moduleName,
      };
    }).filter(Boolean);
  } catch (e) {
    return [];
  }
}
