import {getNamespace} from 'boring-cls';
import React from 'react';
import Loadable from 'react-loadable';
import makeDecorator from '../../../../client/core-hooks/react/proxyGlobalDecorator';
import {unflatten} from 'flat';

function requireModule(importPath) {
  const module = require(importPath);
  return (module.default) ? module.default : module;
}


function makeDecorators(decorators) {
  return Object.keys(decorators).reduce(function(importedDecorators, name) {
    const decorator = decorators[name];
    const importPath = decorator.importPath;

    const newDecorator = makeDecorator(requireModule(importPath), importPath);
    newDecorator.importPath = importPath;
    importedDecorators[name] = newDecorator;
    return importedDecorators;
  }, {});
}

module.exports = function get() {
  const ns = getNamespace('http-request');
  const reactHandlerPaths = ns.get('reactHandlerPaths');

  // console.log('****', Object.keys((reactHandlerPaths.requestContext || {})).length);
  if (reactHandlerPaths.requestContext) return reactHandlerPaths.requestContext;

  if (Object.keys(reactHandlerPaths.containers).length > 0 &&
    !reactHandlerPaths.containersLoaded) {

    const promises = [];
    Object.keys(reactHandlerPaths.containers).forEach(containerName => {
      const container = reactHandlerPaths.containers[containerName];

      // eslint-disable-next-line new-cap
      const lazyContainer = Loadable({
        loader: () => Promise.resolve(requireModule(container.importPath)),
        loading: () => <></>,
        modules: [container.importPath],
      });
      lazyContainer.path = container.path;
      lazyContainer.importPath = container.importPath;
      promises.push(lazyContainer.loader);
      reactHandlerPaths.containers[containerName] = lazyContainer;
    });


    reactHandlerPaths.containersLoaded = Promise.all(promises);

  }

  reactHandlerPaths.decorators = makeDecorators(reactHandlerPaths.decorators);

  const modules = {};
  Object.keys(reactHandlerPaths.modulesToRequire).forEach(moduleName => {
    modules[moduleName] = requireModule(reactHandlerPaths.modulesToRequire[moduleName]);
  });

  reactHandlerPaths.requestContext = {
    containers: reactHandlerPaths.containers,
    decorators: reactHandlerPaths.decorators,
    modules: unflatten(modules),
    context: {},
  };

  return reactHandlerPaths.requestContext;
};
