#!/usr/bin/env node
const fs_extra = require('fs-extra');
const path = require('path')
const paths = require('../dist/node_modules/paths')
const child_process = require('child_process')

async function build() {

  fs_extra.emptyDirSync(paths.app_dist);

  child_process.spawn(path.normalize(__dirname+'/../node_modules/.bin/babel'), ['src', '-d', paths.app_dist, '--source-maps', '--copy-files'],
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