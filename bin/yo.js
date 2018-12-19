#!/usr/bin/env node
const config = require('../config/runtime/boring-config');
const childProcess = require('child_process');
const fs = require('fs-extra');

module.exports = function(args) {
  try {

    const yoPath = __dirname + '/../yo/node_modules/.bin/yo';
    if (!fs.existsSync(yoPath)) {
      console.log('yo is not found in project, installing...');
      childProcess.spawnSync('npm', ['install'], {
        stdio: [process.stdin, process.stdout, process.stderr],
        cwd: __dirname + '/../yo/',
      });
    }
    const yo = childProcess.spawn(yoPath, [__dirname + '/../yo/generator/app'], {
      stdio: [process.stdin, process.stdout, process.stderr],
      cwd: process.cwd(),
    });

    return new Promise((resolve, reject) => {

    });
  } catch (e) {
    console.error('There was a problem the boring command', e);
    return Promise.reject({status: 1});
  }
};
