#!/usr/bin/env node
const fs_extra = require('fs-extra');
const path = require('path')
const paths = require('../dist/node_modules/paths')
const child_process = require('child_process')
const fs = require('fs');

async function build() {

  fs_extra.emptyDirSync(paths.app_dist);
  let babelPath =  '/../node_modules/.bin/babel';
  try {
    fs.statSync(path.normalize(__dirname+babelPath));
  } catch(e) {    
    babelPath =  '/../../.bin/babel';
    fs.statSync(path.normalize(__dirname+babelPath));
  }
  
  child_process.spawn(path.normalize(__dirname+babelPath), ['--no-babelrc', 'src', '-d', paths.app_dist, '--source-maps', '--copy-files', 
    `--presets=${paths.boring_dir}dist/build/wrapped-babel-env,@babel/preset-react`, 
    `--plugins=@babel/plugin-proposal-object-rest-spread,${paths.boring_dir}dist/build/wrapped-babel-plugin-proposal-decorators`],
    {
      stdio: [process.stdin, process.stdout, process.stderr]
    }
  ); 

}

try {
  build();
}
catch(e) {
  console.error('There was a problem running babel on your project', e);
}