
import * as fs from 'fs';
import * as babel from '@babel/core';


export default function getEntryWrappers(reactHandlerPaths, options) {

  function makeConainerCode({path, importPath} = container) {
    const name = path.replace(/\//g, '');
    return `

      const ${name}_container = Loadable({
        loader: () => import('${importPath}'), 
        loading: function Loading() {
          return <div style={{display:'none'}} className="module-loading">loading</div>;
        },
      });

      injecture.registerClass(class ${name}Container {
        getContainer() {
          return ${name}_container;
        }
        getPath() {
          return '${path}'
        }
      }, {
        interfaces: ['AppContainer']
      });
    `;
  }

  const containers = [
    {path: '/adlib/mixer', importPath: 'client/pages/adlib/containers/AdMixer'},
    {path: '/adlib', importPath: 'client/pages/adlib/containers/AdLib'},
  ];

  const code = `
    import Loadable from 'react-loadable';  
    import injecture from 'injecture';
    import React from 'react';
        
  ` + containers.map(makeConainerCode).join('\n');

  const babelOptions = {
    'babelrc': false,
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
  fs.writeFileSync(prefix+'_afterEntry.js', `//afterEntry hook`);


  return [prefix+'_beforeEntry.js', prefix+'_afterEntry.js'];
};
