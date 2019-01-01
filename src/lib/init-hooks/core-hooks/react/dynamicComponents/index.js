
import * as fs from 'fs';
import babel from 'babelCompiler';
import logger from 'boring-logger';

function makeConainerCode({module, moduleName, importPath} = container) {

  return `
  (function() {

    const loadableModule = Loadable({
      loader: () => import('${importPath}'),
      loading: function Loading() {
        return null;
      },
    });
    loadableModule.path = '${module.path}';
    loadableModule.importPath = '${importPath}';

    containers['${moduleName}'] = loadableModule;

  })();

  `;
}

function mapModules(modules) {

  return Object.keys(modules).map(moduleName => {
    return `
      (function requireModule() {
        const requiredMod = require('${modules[moduleName]}');
        modules['${moduleName}'] =  (requiredMod.default) ? requiredMod.default : requiredMod;
      })();
    `;
  }).join('\n');
}


function mapDecorators(decorators) {

  return decorators.map(decorator => {
    return `
      (function requireDecorator() {
        const requiredMod = require('${decorator.importPath}');
        decorators['${decorator.moduleName}'] =  (requiredMod.default) ? requiredMod.default : requiredMod;
      })();
    `;
  }).join('\n');
}

export default function getEntryWrappers(reactRoot, containers = [], modules = {}, decorators = []) {


  const prefix = __dirname + '/dist';
  const beforeFilename = reactRoot + '_beforeEntry.js';

  const beforeEntryFilePath = prefix + '/' + beforeFilename;

  const afterFilename = reactRoot + '_afterEntry.js';
  const afterEntryFilePath = prefix + '/' + afterFilename;

  const code = `
    // THIS IS A GENERATED FILE, PLEASE DO NOT MODIFY
    import Loadable from 'react-loadable';
    import * as React from 'react';

    const containers = {};
    const modules = {};
    const decorators = {};

    if (!window.__boring_internals) {
      window.__boring_internals = {
        wutsthis: 'DO NOT LOOK HERE OR YOU ARE FIRED',
      };
    }

    const internals = window.__boring_internals;

    internals.containers = containers || [];
    internals.modules = modules || {};
    internals.decorators = decorators || {};

    if (!internals.hot) {
      internals.hot = {
        subscribers: [],
        subscribe: function(fn) {
          this.subscribers.push(fn);
        },
        notify: function() {
          this.subscribers.forEach(fn => {
            console.log('notifying subscriber of a change');
            fn();
          });
        },
      };
    } else {
      setTimeout(() => {
        // I know this seems jank but it's ONLY
        // when we are in a partial state because HMR
        internals.hot.notify();
      }, 1);
    }

    if (module.hot) {
      module.hot.accept(err => console.log('error reloading', err));
    }

  ` + mapDecorators(decorators)
    + containers.map(makeConainerCode).join('\n')
    + mapModules(modules);

  const babelResults = babel(code);

  let writeNewBefore = true;
  if (fs.existsSync(beforeEntryFilePath)) {
    if (fs.readFileSync(beforeEntryFilePath) == babelResults.code) {
      writeNewBefore = false;
      logger.debug(`The fle ${beforeEntryFilePath} has already been generated, nothing has changed`);
    }
  }

  if (writeNewBefore) {
    logger.debug(`The fle ${beforeEntryFilePath} is being generated, please do not change it's contents`);
    fs.writeFileSync(beforeEntryFilePath, babelResults.code);
    fs.writeFileSync(beforeEntryFilePath+'.map', JSON.stringify(babelResults.map));
  }

  fs.writeFileSync(afterEntryFilePath, `//afterEntry hook`);


  return [beforeEntryFilePath, afterEntryFilePath];
};
