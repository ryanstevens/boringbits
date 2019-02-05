const config = require('../config/runtime/boring-config');
const childProcess = require('child_process');
const fs = require('fs');
const promisify = require('util').promisify;
const ncp = promisify(require('ncp'));
const rimraf = promisify(require('rimraf'));
const mkdirp = promisify(require('mkdirp'));

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

    if (!fs.existsSync(process.cwd() + '/serverless.yml') || !fs.existsSync(process.cwd() + '/handler.js')) {
      childProcess.spawnSync('npx', ['boringbits', 'yo', '--props', '{"scope": "deploy", "deployment": "Lambda", "scripts": []}'], {
        stdio: [process.stdin, process.stdout, process.stderr],
        cwd: process.cwd(),
      });
    }

    await createDeployable();

    childProcess.spawnSync('npx', ['serverless', 'deploy'], {
      stdio: [process.stdin, process.stdout, process.stderr],
      cwd: deployDir,
    });


    return Promise.resolve();

  } catch (e) {
    console.error('There was a problem the boring command', e);
    return Promise.reject({status: 1});
  }
};

async function createDeployable() {
  ncp.limit = 16;

  const deployDir = process.cwd() + '/.boring/deploy';
  const dest = deployDir + '/node_modules';
  const requiredModulesLoc = process.cwd() + '/dist/required-modules.json';
  await rimraf(deployDir);
  await mkdirp(dest);

  const modsToCopy = ['binary-case', 'aws-serverless-express'];

  if (!fs.existsSync(requiredModulesLoc)) {
    fs.lstatSync(process.cwd() + '/node_modules').forEach(folder => modsToCopy.push(folder));
  } else {
    const modules = require(requiredModulesLoc).modules;
    Object.keys(modules).forEach(key => modsToCopy.push(key));
  }

  const copyPromises = [];

  ['/dist', '/build', '/config'].forEach(folder => {
    copyPromises.push(ncp(
      process.cwd() + '/' + folder,
      deployDir +'/'+ folder
    ));
  });


  modsToCopy.forEach(module => {
    copyPromises.push(ncp(
      process.cwd() + '/node_modules/'+module,
      dest +'/'+ module
    ));
  });
  await Promise.all(copyPromises);

  fs.copyFileSync(process.cwd() + '/handler.js', deployDir + '/handler.js');
  fs.copyFileSync(process.cwd() + '/serverless.yml', deployDir + '/serverless.yml');

}
