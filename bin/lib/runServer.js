#!/usr/bin/env node
const paths = require('../../config/runtime/paths');
const childProcess = require('child_process');
const split = require('split2');
const through2 = require('through2');
const opn = require('opn');
const checkProxy = require('./checkProxy.js');
const inquirer = require('inquirer');
const chalk = require('chalk');

module.exports = async function run(isDevelopment, debug, urlToOpen) {


  console.log('running ' + paths.main_server);

  if (isDevelopment) {

    const status = await checkProxy();
    console.log(status);

    if (status.haProxyStatus === 'DOWN') {

      console.log(`

  ${chalk.red(`******************************************************************************`)}
  ${chalk.red(`**                                                                          **`)}
  ${chalk.red(`**  ${chalk.white.bold('🔥🔥🔥  Warining 🔥🔥🔥  Boring has detected there is no local reverse proxy')}  **`)}
  ${chalk.red(`**                                                                          **`)}
  ${chalk.red(`******************************************************************************`)}


  ${chalk.yellow.bold(`Why should I care?`)}
      Mainly because boring requires all traffic to come
      through from browsers using HTTPS protocol, as
      well as using a real domain (not localhost).

  ${chalk.yellow.bold(`Why take such a hard stance on this?`)}
      Core members of boring strongly believe developing
      in an environment as close to production as possible
      will create the most stable and secure code.
      Discussion around this topic welcome, please open
      github issues https://github.com/dynosrc/boring/issues

  ${chalk.yellow.bold(`Okay fine, how do I move forward?`)}
      Boring ships with HAProxy, you only need to have
      docker installed on your machine.  We have tested
      this setup for both mac and windows (via WSL).
      https://www.docker.com/products/docker-desktop

      `);
      const launchProxy = await inquirer
        .prompt([{
          type: 'list',
          name: 'startProxy',
          message: 'Do you want boring to boot up a local HA Proxy (via docker)?\nOne time step and as the container is ran in the background.',
          choices: [
            {name: chalk.bold('Yes, run HA Proxy for me'), value: true},
            {name: 'No, I\'ll figure something else out', value: false},
          ],
        }]);

      if (launchProxy.startProxy) {
        childProcess.spawnSync('npx', ['boring', 'up'], {
          stdio: [process.stdin, process.stdout, process.stdout],
          cwd: process.cwd(),
        });

        console.log(`
  ${chalk.yellow.bold(`All done!  HA Proxy is running in a docker container.`)}
  ${chalk.yellow.bold(`Your server will now resume, you should not see this `)}
  ${chalk.yellow.bold(`prmopt again unless your docker container crashes`)}

******************************************************************************

        `);
      }

    }

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
          setTimeout(() => {
            opn(urlToOpen);
          }, 2000); // give ha proxy time to register
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
