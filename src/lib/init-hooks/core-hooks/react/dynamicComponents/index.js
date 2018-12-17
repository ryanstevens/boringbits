
import * as fs from 'fs';
import * as babel from '@babel/core';


export default function getEntryWrappers(reactHandlerPaths, options) {

  function makeConainerCode({path, importPath} = container) {
    const name = path.replace(/\//g, '');
    return `

      const ${name}_container = Loadable({
        loader: () => import('${importPath}'), 
        loading: function Loading() {
          return <></>;
        },
      });

      injecture.registerClass(class ${name}Container {
        getContainer() { return ${name}_container; }
        getPath() { return '${path}' }
      }, {
        interfaces: ['AppContainer']
      });
    `;
  }

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

  const code = `
    import Loadable from 'react-loadable';  
    import injecture from 'injecture';
    import React from 'react';
        
  ` + containers.map(makeConainerCode).join('\n');

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

  const prefix = __dirname + '/dist/'+reactHandlerPaths.reactRoot;
  fs.writeFileSync(prefix+'_beforeEntry.js', babelResults.code);
  fs.writeFileSync(prefix+'_beforeEntry.js.map', JSON.stringify(babelResults.map));
  fs.writeFileSync(prefix+'_afterEntry.js', `//afterEntry hook`);


  return [prefix+'_beforeEntry.js', prefix+'_afterEntry.js'];
};
