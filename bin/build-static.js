process.env.NODE_ENV = 'production';
process.env.boring_build_staticgen = 'true';
// this disables boring check for a real domain / subdomain / https
process.env.boring_default_subdomain = false;

const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const paths = require('../config/runtime/paths');
const assert = require('assert');
const childProcess = require('child_process');
const runServer = require('./lib/runServer');


async function checkDir(name, dir) {
  try {
    assert.ok(await stat(dir));
  } catch (e) {
    console.log(chalk.red(`

  ************** ERROR BUILDING STATIC SITE **************

    The following ${name} directory does not exist.

    ${paths.app_dist}

    Please do a \`npm run build\` first before attempting a static
    build of your boring project.  All static builds must
    be ran against "production" code as they are simply a snapshot

  *********************************************************
  `));

    const answer = await inquirer.prompt([{
      type: 'list',
      name: 'build',
      message: 'I can run a build for you, would you like me to?',
      choices: [
        {name: chalk.bold('Yes, do an npm run build'), value: true},
        {name: 'No, I\'ll handle the build myself', value: false},
      ],
    }]);

    if (answer.build) {
      childProcess.spawnSync('npx', ['boringbits', 'build-node'],
        {
          stdio: [process.stdin, process.stdout, process.stderr],
          cwd: process.cwd(),
        }
      );

      childProcess.spawnSync('npx', ['boringbits', 'build-client'],
        {
          stdio: [process.stdin, process.stdout, process.stderr],
          cwd: process.cwd(),
        }
      );
    } else {
      process.exit(1);
    }
  }
}

module.exports = async function(args) {

  await checkDir('dist', paths.app_dist);
  await checkDir('build', paths.app_build);

  return new Promise((resolve, reject) => {

    try {
      runServer(false);
    } catch (e) {
      console.log(e);
    }

  });
};
