#!/usr/bin/env node
const path = require('path');
const childProcess = require('child_process');
const fs = require('fs');


async function run(argv) {

  let tscPath = '/../node_modules/.bin/tsc';
  try {
    fs.statSync(path.normalize(__dirname+tscPath));
  } catch (e) {
    tscPath = '/../../.bin/tsc';
    fs.statSync(path.normalize(__dirname+tscPath));
  }

  const args = [
    '--noEmit',
    '--p',
    path.normalize(process.cwd()),
  ];

  if (argv.watch) {
    args.push('--watch');
  }
  console.log('tcs ', args.join(' '));

  return childProcess.spawnSync(path.normalize(__dirname+tscPath), args,
      {
        stdio: [process.stdin, process.stdout, process.stderr],
        cwd: process.cwd(),
      }
  );

}

module.exports = function(args) {
  try {
    try {
      fs.statSync(process.cwd() + '/tsconfig.json');
      console.log('tsconfig.json found in ' + process.cwd());
    } catch (e) {
      console.log(`Copying ${path.resolve(__dirname, '../tsconfig.json')} -> ${path.resolve(process.cwd(), '/tsconfig.json, feel free to edit this and make it your own')}`);
      fs.copyFileSync(path.resolve(__dirname, '../tsconfig.json'), process.cwd() + '/tsconfig.json');
    }
    return run(args.argv);
  } catch (e) {
    console.error('There was a problem the boring command', e);
    return Promise.reject({status: 1});
  }
};
