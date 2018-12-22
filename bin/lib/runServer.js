#!/usr/bin/env node
const paths = require('../../config/runtime/paths');
const childProcess = require('child_process');
const split = require('split2');
const through2 = require('through2');
const opn = require('opn');
const retryerer = require('./retryerer');
const runBeforeChecks = require('./runBeforeStartChecks');

module.exports = async function run(isDevelopment, debug, urlToOpen) {


  console.log('running ' + paths.main_server);

  if (isDevelopment) {

    await runBeforeChecks();

    const args = [paths.main_server];
    if (debug) args.unshift('--inspect-brk');

    const node = childProcess.spawn('node', args, {
      stdio: ['ignore', 'pipe', process.stderr],
      cwd: process.cwd(),
    });

    const bunyan = childProcess.spawn('npx', ['bunyan'], {
      stdio: ['pipe', process.stdout, 'ignore'],
      cwd: process.cwd(),
    });

    const logIntercept = through2.obj((data, enc, cb) => {
      try {
        const line = JSON.parse(data);
        if (urlToOpen && line.msg === 'Listening on port 5000') {
          (async function() {
            try {
              const health = await retryerer('http://www.boringlocal.com/__health', 15);
              if (JSON.parse(health).status === 'ok') {
                opn(urlToOpen);
              }
            } catch (e) {
              console.log('Could not open URL, something seems wrong with bootup', e);
            }
          })();

        }
      } catch (e) {}
      cb(null, data+'\n');
    });

    // node.stderr
    //   .pipe(split())
    //   .pipe(logIntercept)
    //   .pipe(bunyan.stdin);

    node.stdout
      .pipe(split())
      .pipe(logIntercept)
      .pipe(bunyan.stdin);

  } else {
    // for production, just boot the server by directly requiring
    require(paths.main_server);
  }

  return new Promise((resolve, reject) => {
    // no need to resolve, users will simply
    // kill the process
  });

};
