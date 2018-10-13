#!/usr/bin/env node
const fs_extra = require('fs-extra');
const path = require('path')
const paths = require('../dist/node_modules/paths')
const child_process = require('child_process')
const fs = require('fs');

async function build() {

  fs_extra.emptyDirSync(paths.app_dist);
  let babelPath = '/../.bin/babel';
  try {
    fs.statSync(path.normalize(__dirname+babelPath));
  } catch(e) {    
    babelPath =  '/../../node_modules/.bin/babel';
    fs.statSync(path.normalize(__dirname+babelPath));
  }
  

  child_process.spawn(path.normalize(__dirname+babelPath), ['src', '-d', paths.app_dist, '--source-maps', '--copy-files'],
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