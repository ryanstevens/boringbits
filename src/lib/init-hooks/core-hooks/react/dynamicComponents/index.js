
import * as fs from 'fs';
import * as babel from '@babel/core';
import logger from 'boring-logger';
import beforeEntryLoader from './beforeEntryLoader';

function makeConainerCode({path, importPath} = container) {
  const name = path.replace(/\//g, '');

  /*
  // TODO: I had to backpedal a bit on
  // making these routez lazy loaded via
  // webpacks optimization chunks.
  // Should be too hard to renable,
  // was just having some trouble keeping
  // hot reload working which is more of a
  // priority
  
  */

  return `
  console.log('setting dynamic target: ${name}');
  (function() {
    containers.push({
      path: '${path}',
      container: Loadable({
        loader: () => import('${importPath}'),
        loading: function Loading() {
          return <></>;
        },
      })
    });
  })();

  `;
}

function makeModuleCode(modules) {

  return Object.keys(modules).map(moduleName => {
    return `
      modules['${moduleName}'] = require('${modules[moduleName]}').default;
    `;
  }).join('\n');
}

export default function getEntryWrappers(reactHandlerPaths, modules = {}) {


  const containers = reactHandlerPaths
      .containers
      .filter(container => container.path)
      .sort((containerA, containerB) => {
        /**
         * This is a reverse sort on the path, the
         * goal here is so paths that are more specific
         * end up rendering first and the "default"
         * path, which is typically the shortest
         * will be at the bottom.  For now
         * this seems to work but I assume someone
         * will tell me a use case and we'll have to
         * rework this
         */
        if (containerA.path.length<containerB.path.length) return 1;
        if (containerA.path.length>containerB.path.length) return -1;
        return 0;
      });

  if (containers.legnth === 0) return [];

  const prefix = __dirname + '/dist';
  const beforeFilename = reactHandlerPaths.reactRoot + '_beforeEntry.js';

  const beforeEntryFilePath = prefix + '/' + beforeFilename;

  const afterFilename = reactHandlerPaths.reactRoot + '_afterEntry.js';
  const afterEntryFilePath = prefix + '/' + afterFilename;

  const code = `
    // THIS IS A GENERATED FILE, PLEASE DO NOT MODIFY
    import Loadable from 'react-loadable';
    import * as React from 'react';

    const containers = [];
    const modules = [];
  ` + containers.map(makeConainerCode).join('\n')
    + makeModuleCode(modules)
    + beforeEntryLoader.toString()
    + '\nbeforeEntryLoader();';

  const babelOptions = {
    'babelrc': false,
    'sourceMaps': true,
    'presets': [
      ['@babel/preset-env', {
        'targets': {
          'ie': '11',
        },
      }],
      '@babel/preset-react',
    ],
    'plugins': [
      '@babel/plugin-proposal-object-rest-spread',
      ['@babel/plugin-proposal-decorators', {
        legacy: true,
      }],
      ['@babel/plugin-syntax-dynamic-import'],
    ],
  };

  const babelResults = babel.transformSync(code, babelOptions);


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
