const config = require('../config/runtime/boring-config');
const childProcess = require('child_process');

module.exports = async function(args) {
  try {

    childProcess.spawnSync('npx', ['boringbits', 'build-node'], {
      stdio: [process.stdin, process.stdout, process.stderr],
      cwd: process.cwd(),
    });

    childProcess.spawnSync('npx', ['boringbits', 'build-client'], {
      stdio: [process.stdin, process.stdout, process.stderr],
      cwd: process.cwd(),
    });

    childProcess.spawnSync('npx', ['serverless', 'deploy'], {
      stdio: [process.stdin, process.stdout, process.stderr],
      cwd: process.cwd(),
    });

    return Promise.resolve();

  } catch (e) {
    console.error('There was a problem the boring command', e);
    return Promise.reject({status: 1});
  }
};
