
const checkProxy = require('./checkProxy.js');
const inquirer = require('inquirer');
const chalk = require('chalk');
const childProcess = require('child_process');

async function tryDocker() {
  const dockerResults = childProcess.spawnSync('npx', ['boring', 'up'], {
    stdio: [process.stdin, process.stdout, process.stdout],
    cwd: process.cwd(),
  });

  if (dockerResults.status !== 0) {
    console.log(`
${chalk.red.bold(`Sorry, there was a problem lunching the docker instance.`)}
Maybe try runing \`docker ps\` to check if docker if
running properly on your system.

    `);

    const relaunch = await inquirer
      .prompt([{
        type: 'list',
        name: 'startProxy',
        message: 'Would you like boring to try again and launch HA Proxy as a docker container',
        choices: [
          {name: chalk.bold('Yes, run HA Proxy for me'), value: true},
          {name: 'No, I\'ll figure something else out', value: false},
        ],
      }]);

    if (relaunch.startProxy) {
      return await tryDocker();
    }
    return false;
  } return true;
}

module.exports = async function runChecks() {
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
      if (await tryDocker() === false) {
        console.log(`
${chalk.yellow('Okey doak, starting your application without Boring\'s local proxy')}
Please make sure there is _some_ proxy running because you can not
hit a boring route unless the HTTP request is secure and over a
proper domain (not localhost).  TO be clear, this means
HTTPS + domain + TLD and NO PORT

Examples
http://www.boringlocal.com       ${chalk.red('BAD - Not Secure')}
https://www.boringlocal.com:5000 ${chalk.red('BAD - port # in url')}
http://localhost:5000            ${chalk.red('BAD - Common, really')}
https://mydomain.local           ${chalk.green('GOOD')}
https://www.mydomain.local       ${chalk.green('GOOD')}
https://www.mydomain.com         ${chalk.green('GOOD')}
https://super.www.mydomain.com   ${chalk.green('GOOD')}
https://super.www.localtest.me   ${chalk.green('GOOD')}
https://www.boringlocal.com      ${chalk.green('GOOD (this is borings default domain to test on btw)')}

`);
      } else {
        console.log(`
${chalk.yellow.bold(`All done!  HA Proxy is running in a docker container.`)}
${chalk.yellow.bold(`Your server will now resume, you should not see this `)}
${chalk.yellow.bold(`prompt again unless your docker instance crashes`)}

******************************************************************************

        `);
      }
    }
  }

  if (status.appStatus === 'UP') {

    console.log(`

${chalk.red(`*************************************************************`)}
${chalk.red(`**                                                         **`)}
${chalk.red(`**      🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥  Warining   🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥          **`)}
${chalk.red(`**                                                         **`)}
${chalk.red(`**        Boring has detected another app running          **`)}
${chalk.red(`**    on the port 5000, please kill the other process      **`)}
${chalk.red(`**                                                         **`)}
${chalk.red(`*************************************************************`)}

  `);

    const continueQuestion = await inquirer
      .prompt([{
        type: 'list',
        name: 'continue',
        message: 'Please feel free to continue if you have killed which ever process was listening on 5000',
        choices: [
          {name: chalk.bold('Continue'), value: true},
          {name: 'nvm, I\'ll try again', value: false},
        ],
      }]);

    if (!continueQuestion.continue) {
      return Promise.reject('Stopped npm start due to port collision');
    }
  }
};
