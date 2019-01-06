import {getNamespace} from 'boring-cls';
import React from 'react';
import Loadable from 'react-loadable';
import logger from 'boring-logger';


module.exports = function get() {
  const ns = getNamespace('http-request');
  const reactHandlerPaths = ns.get('reactHandlerPaths');

  debugger;
  if (Object.keys(reactHandlerPaths.containers).length > 0 &&
    !reactHandlerPaths.containersLoaded) {

    const promises = [];
    Object.keys(reactHandlerPaths.containers).forEach(containerName => {
      const container = reactHandlerPaths.containers[containerName];
      // eslint-disable-next-line new-cap
      const lazyContainer = Loadable({
        loader: () => Promise.resolve(require(container.importPath)),
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

  return reactHandlerPaths;
};
