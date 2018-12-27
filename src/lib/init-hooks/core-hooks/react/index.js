import Layout from './Layout';
import decorators from '../../../decorators';
import getReactHandlerPaths from './reactHandlerPaths';
import renderRedux from './renderRedux';
import dynamicComponents from './dynamicComponents';
import fs from 'fs-extra';

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

      const reactHandlerPaths = getReactHandlerPaths(options);

      reactHandlerPaths.decorators = getDecorators(reactHandlerPaths);
      reactHandlerPaths.containers = getContainers(reactHandlerPaths);

      const [beforeEntry, afterEntry] = dynamicComponents(
        reactHandlerPaths.reactRoot,
        reactHandlerPaths.containers,
        reactHandlerPaths.modulesToRequire,
        reactHandlerPaths.decorators
      );

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
  const containersDirPath = reactHandlerPaths.app_dir +'/'+ reactHandlerPaths.routerContainersPath;
  try {
    return fs.readdirSync(containersDirPath).map(function(file) {
      if (file.endsWith('.map')) return null;
      const moduleName = file.split('.').shift(); // don't worry about what type of extension
      const container = require(containersDirPath + '/' + moduleName).default;
      return {
        path: container.path,
        container,
        moduleName,
        importPath: reactHandlerPaths.routerContainersPath + '/' + moduleName,
      };
    }).filter(Boolean);
  } catch (e) {
    return [];
  }
}


function getDecorators(reactHandlerPaths) {
  const decoratorsPath = reactHandlerPaths.app_dir +'/'+ reactHandlerPaths.decoratorsPath;
  try {
    return fs.readdirSync(decoratorsPath).map(function(file) {
      if (file.endsWith('.map')) return null;
      const moduleName = file.split('.').shift(); // don't worry about what type of extension
      return {
        moduleName,
        // decorator: require(decoratorsPath + '/' + moduleName).default,
        importPath: reactHandlerPaths.decoratorsPath + '/' + moduleName,
      };
    }).filter(Boolean);
  } catch (e) {
    return [];
  }
}
