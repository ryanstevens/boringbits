#!/usr/bin/env node
const paths = require('../../config/runtime/paths');
const childProcess = require('child_process');

module.exports = async function run(isDevelopment, debug) {

  console.log('running ' + paths.main_server);

  const args = [paths.main_server];
  if (debug) args.unshift('--inspect-brk');

  const node = childProcess.spawn('node', args, {
    stdio: ['ignore', 'pipe', process.stderr],
    cwd: process.cwd(),
  });

  if (isDevelopment) {
    const bunyan = childProcess.spawn('npx', ['bunyan'], {
      stdio: ['pipe', process.stdout, process.stderr],
      cwd: process.cwd(),
    });

    node.stdout.pipe(bunyan.stdin);
  }

  return new Promise((resolve, reject) => {
    // no need to resolve, users will simply
    // kill the process
  });

};
