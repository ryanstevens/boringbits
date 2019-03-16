#!/usr/bin/env node
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const fsExtra = require('fs-extra');
const path = require('path');
const paths = require('../src/node_modules/paths');
const childProcess = require('child_process');
const fs = require('fs');

async function build(buildParams) {

  fsExtra.emptyDirSync(buildParams.dist);
  let babelPath = '/../node_modules/.bin/babel';
  try {
    fs.statSync(path.normalize(__dirname+babelPath));
  } catch (e) {
    babelPath = '/../../.bin/babel';
    fs.statSync(path.normalize(__dirname+babelPath));
  }


  const presets = [
    `${paths.boring_dir}src/build/${buildParams.babelEnv}`,
    `@babel/preset-typescript,@babel/preset-react`,
  ].join(',');

  const plugins = [
    `@babel/plugin-proposal-object-rest-spread`,
    `${paths.boring_dir}src/build/wrapped-babel-plugin-proposal-decorators`,
    `@babel/plugin-proposal-class-properties`,
    `@babel/plugin-syntax-dynamic-import`,
  ].join(',');

  const args = [
    '--no-babelrc',
    buildParams.src,
    '-d', buildParams.dist,
    `--extensions=.ts,.tsx,.js,.jsx`,
    '--source-maps',
    '--copy-files',
    `--presets=${presets}`,
    `--plugins=${plugins}`,
  ];

  return childProcess.spawnSync(path.normalize(__dirname+babelPath), args,
    {
      stdio: [process.stdin, process.stdout, process.stderr],
      cwd: process.cwd(),
    }
  );

}

module.exports = function(argv) {
  try {
    const buildParams = (argv.argv.buildClient) ? {
      babelEnv: 'wrapped-babel-env-client',
      dist: paths.app_dist+'/client',
      src: 'src/client',
    } : {
      babelEnv: 'wrapped-babel-env',
      dist: paths.app_dist,
      src: 'src',
    };
    return build(argv.argv.buildParams || buildParams);

  } catch (e) {
    console.error('There was a problem running babel on your project', e);
    return Promise.reject({status: 1});
  }
};
