
import * as fs from 'fs';
import babel from 'babelCompiler';
import logger from 'boring-logger';
import normalize from 'normalize-path';

function mapContainerCode(containers) {

  return Object.keys(containers).map(moduleName => {
    const module = containers[moduleName];
    const {importPath, path} = module;
    return `
    (function() {

      const loadableModule = Loadable({
        loader: () => import('${normalize(importPath)}'),
        loading: function Loading() {
          return null;
        },
      });
      loadableModule.path = '${path}';
      loadableModule.importPath = '${normalize(importPath)}';

      containers['${moduleName}'] = loadableModule;

    })();

    `;
  }).join('\n');

}

function mapModules(modules) {

  return Object.keys(modules).map(moduleName => {
    return `
      (function requireModule() {
        const requiredMod = require('${normalize(modules[moduleName])}');
        modules['${moduleName}'] =  (requiredMod.default) ? requiredMod.default : requiredMod;
      })();
    `;
  }).join('\n');
}

// eslint-disable-next-line valid-jsdoc
/**
* The following code is in place only for local dev / HMR to work.
*
* Okay, this is a bit strange- the reason why we are wrapping "decorators"
* is because they are ultimately imported via boring and dynamically "glued"
* together with whomever needs HOC / decorators.  This means when a developer
* updates one of the source files HMR will not cause the render cycle to
* render the most up to date changes from these decorators beause the
* import / require depencancy tree is outside of the rest of the app.
**/
function mapDecoratorCode(decorators) {

  return Object.keys(decorators).map(moduleName => {
    const module = decorators[moduleName];
    const {importPath} = module;
    return `
    (function requireDecorator() {
      const requiredMod = require('${normalize(importPath)}');
      const Mod = (requiredMod.default) ? requiredMod.default : requiredMod;
      __boring_internals.freshModules['${moduleName}'] = Mod;

      const WrappedModuleToDecorate = hoistNonReactStatic(class extends React.Component {
        render() {
          const FreshModule = __boring_internals.freshModules['${moduleName}'];
          return <FreshModule {...this.props} />
        }
      }, Mod);
      decorators['${moduleName}'] = makeDecorator(WrappedModuleToDecorate);

    })();
    `;
  }).join('\n');

}

export default function getEntryWrappers(reactRoot, containers = {}, modules = {}, decorators = {}) {


  const prefix = __dirname + '/dist';
  const beforeFilename = reactRoot + '_beforeEntry.js';

  const beforeEntryFilePath = prefix + '/' + beforeFilename;

  const afterFilename = reactRoot + '_afterEntry.js';
  const afterEntryFilePath = prefix + '/' + afterFilename;

  const code = `
    // THIS IS A GENERATED FILE, PLEASE DO NOT MODIFY
    import Loadable from 'react-loadable';
    import * as React from 'react';
    import {makeDecorator} from '../../../../../../client/core-hooks/react/decoratorUtil';
    import hoistNonReactStatic from 'hoist-non-react-statics';

    const containers = {};
    const modules = {};
    const decorators = {};

    if (!window.__boring_internals) {
      window.__boring_internals = {
        wutsthis: 'DO NOT LOOK HERE OR YOU ARE FIRED',
        freshModules: {},
      };
    }

    const internals = window.__boring_internals;

    internals.containers = containers;
    internals.modules = modules;
    internals.decorators = decorators;

    if (!internals.hot) {
      internals.hot = {
        subscribers: [],
        subscribe: function(fn) {
          this.subscribers.push(fn);
        },
        notify: function() {
          this.subscribers.forEach(fn => {
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

  ` + mapDecoratorCode(decorators)
    + mapContainerCode(containers)
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
