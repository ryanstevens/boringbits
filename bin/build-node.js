#!/usr/bin/env node
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const fsExtra = require('fs-extra');
const path = require('path');
const paths = require('../dist/node_modules/paths');
const childProcess = require('child_process');
const fs = require('fs');

async function build() {

  fsExtra.emptyDirSync(paths.app_dist);
  let babelPath = '/../node_modules/.bin/babel';
  try {
    fs.statSync(path.normalize(__dirname+babelPath));
  } catch (e) {
    babelPath = '/../../.bin/babel';
    fs.statSync(path.normalize(__dirname+babelPath));
  }

  const args = [
    '--no-babelrc',
    'src', '-d', paths.app_dist,
    `--extensions=.ts,.tsx,.js,.jsx`,
    '--source-maps',
    '--copy-files',
    `--presets=${paths.boring_dir}dist/build/wrapped-babel-env,@babel/preset-typescript,@babel/preset-react`,
    `--plugins=@babel/plugin-proposal-object-rest-spread,${paths.boring_dir}dist/build/wrapped-babel-plugin-proposal-decorators,@babel/plugin-proposal-class-properties,@babel/plugin-syntax-dynamic-import`,
  ];

  console.log('babel ' +args.join(' '));

  return childProcess.spawnSync(path.normalize(__dirname+babelPath), args,
    {
      stdio: [process.stdin, process.stdout, process.stderr],
      cwd: process.cwd(),
    }
  );

}

module.exports = function(argv) {
  try {
    return build();
  } catch (e) {
    console.error('There was a problem running babel on your project', e);
    return Promise.reject({status: 1});
  }
};
