#!/usr/bin/env node
const fs_extra = require('fs-extra');
const path = require('path')
const paths = require('../dist/node_modules/paths')
const child_process = require('child_process')
const fs = require('fs');

async function build() {

  fs_extra.emptyDirSync(paths.app_dist);

  child_process.spawn('docker-compose', ['down'],
    {
      stdio: [process.stdin, process.stdout, process.stderr],
      cwd: path.normalize(__dirname + '/..')
    }
  ); 

}

try {
  build();
}
catch(e) {
  console.error('There was a problem booting up docker', e);
}