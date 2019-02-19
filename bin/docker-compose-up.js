#!/usr/bin/env node
const config = require('../config/runtime/boring-config');
const fsExtra = require('fs-extra');
const path = require('path');
const paths = require('../dist/node_modules/paths');
const childProcess = require('child_process');

async function build() {

  fsExtra.emptyDirSync(paths.app_dist);

  console.log(process.cwd(), config.get('test'));
  const dockerConfig = config.get('boring.docker.infrastructure');

  const servers = Object.keys(dockerConfig).filter(key => dockerConfig[key] === true);

  const args = ['up', '-d'];
  servers.forEach(server => args.push(server));

  console.log('docker-compose ' + args.join(' '));
  return childProcess.spawnSync('docker-compose', args,
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
