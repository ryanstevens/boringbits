process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

const config = require('config');
require('./env');

const path = require('path');

const ourConfigDir = path.join(__dirname, '/../../config');
const baseConfig = config.util.loadFileConfigs(ourConfigDir);

config.util.setModuleDefaults('boring', baseConfig);

const get = config.get;
const has = config.has;

config.get = function configGetShadowed(key, defaultVal) {
  let retVal = defaultVal;
  const flattendKey = key.split('.').join('_');

  if (key in process.env) retVal = process.env[key];
  else if (flattendKey in process.env) retVal = process.env[flattendKey];
  else if (config.has(key)) retVal = get.call(config, key);

  if (typeof retVal === 'string') {
    if (retVal === 'true') return true;
    else if (retVal === 'false') return false;
  }
  return retVal;
};

config.has = function configHasShadowed(key) {
  if (key in process.env) return true;
  const flattendKey = key.split('.').join('_');
  if (flattendKey in process.env) return true;

  if (has.call(config, key)) return true;
  else return false;
};

module.exports = config;
