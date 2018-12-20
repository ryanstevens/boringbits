#!/usr/bin/env node
const fsExtra = require('fs-extra');
const path = require('path');
const paths = require('../dist/node_modules/paths');
const childPocess = require('child_process');

async function build() {

  fsExtra.emptyDirSync(paths.app_dist);

  return childPocess.spawnSync('docker-compose', ['down'],
      {
        stdio: [process.stdin, process.stdout, process.stderr],
        cwd: path.normalize(__dirname + '/..'),
      }
  );

}

module.exports = function(argv) {
  try {
    return build();
  } catch (e) {
    console.error('There was a problem booting up docker', e);
    return Promise.reject(e);
  }
};
