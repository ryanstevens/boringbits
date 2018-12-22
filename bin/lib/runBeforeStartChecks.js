
const checkProxy = require('./checkProxy.js');
const inquirer = require('inquirer');
const chalk = require('chalk');


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
