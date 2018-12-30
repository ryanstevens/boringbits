import Layout from './Layout';
import decorators from '../../../decorators';
import getReactHandlerPaths from './reactHandlerPaths';
import renderRedux from './renderRedux';
import dynamicComponents from './dynamicComponents';
import fs from 'fs-extra';
import {getNamespace} from 'boring-cls';
import logger from 'boring-logger';

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

      let beforeEntry;
      let afterEntry;

      const reactHandlerPaths = getReactHandlerPaths(options);

      const reactNS = getNamespace('http-request');
      reactNS.run(function() {
        reactNS.set('reactHandlerPaths', reactHandlerPaths);

        // actually run `require` on decorators / containers
        const decorators = requireDirectory(reactHandlerPaths.app_dir, reactHandlerPaths.decoratorsPath);
        reactHandlerPaths.decorators = reduceMods(decorators);

        const containers = requireDirectory(reactHandlerPaths.app_dir, reactHandlerPaths.routerContainersPath);
        reactHandlerPaths.containers = reduceMods(containers);

        [beforeEntry, afterEntry] = dynamicComponents(
          reactHandlerPaths.reactRoot,
          containers,
          reactHandlerPaths.modulesToRequire,
          decorators
        );

      });

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
      const reactNS = getNamespace('http-request');
      if (reactNS && reactNS.set) {
        try {
          reactNS.set('reactHandlerPaths', ctx.res.reactPaths);
        } catch (e) {
          logger.trace(e, 'problem setting reactHandlerPaths');
        }
      }
    }

    return Promise.resolve();
  });


  boring.react = {
    Layout,
  };

  return {name: 'react'};
};

function reduceMods(mods) {
  return mods.reduce((acc, cur) => {
    cur.module.importPath = cur.importPath;
    acc[cur.moduleName] = cur.module;
    return acc;
  }, {});
}

function requireDirectory(appDir, directoryPath) {
  const dirToRead = appDir +'/'+ directoryPath;
  try {
    if (!fs.existsSync(dirToRead)) return [];
    return fs.readdirSync(dirToRead).map(function(file) {
      if (file.endsWith('.map')) return null;
      const fileParts = file.split('.');
      if (fileParts.length > 1) fileParts.pop();
      const moduleName = fileParts.join('.'); // don't worry about what type of extension
      const mod = require(dirToRead + '/' + moduleName);
      return {
        moduleName,
        module: (mod.default) ? mod.default : mod,
        importPath: directoryPath + '/' + moduleName,
      };
    }).filter(Boolean);

  } catch (e) {
    logger.error(e, 'Problem requiring directory');
    return [];
  }
}
