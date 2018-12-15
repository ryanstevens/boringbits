
import * as fs from 'fs';
import * as babel from '@babel/core';


export default function getEntryWrappers(reactHandlerPaths, options) {

  const code = `
    import Loadable from 'react-loadable';
    import injecture from 'injecture';
    import React from 'react';
        
    const adMixer = Loadable({
      loader: () => import('client/pages/adlib/containers/AdMixer'), 
      loading: function Loading() {
        return <div style={{display:'none'}} className="module-loading">loading</div>;
      },
    });

    injecture.registerClass(class AdMixerContainer {
      getContainer() {
        return adMixer;
      }
      getPath() {
        return '/adlib/mixer'
      }
    }, {
      interfaces: ['AppContainer']
    });

  `;

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
