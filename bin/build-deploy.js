const config = require('../config/runtime/boring-config');
const childProcess = require('child_process');
const fs = require('fs');
const promisify = require('util').promisify;
const ncp = promisify(require('ncp'));
const rimraf = promisify(require('rimraf'));
const mkdirp = promisify(require('mkdirp'));

module.exports = async function(args) {
  try {

    childProcess.spawnSync('npx', ['boringbits', 'build'], {
      stdio: [process.stdin, process.stdout, process.stderr],
      cwd: process.cwd(),
    });

    childProcess.spawnSync('npx', ['boringbits', 'deploy'], {
      stdio: [process.stdin, process.stdout, process.stderr],
      cwd: process.cwd(),
    });


    return Promise.resolve();

  } catch (e) {
    console.error('There was a problem the boring command', e);
    return Promise.reject({status: 1});
  }
};
