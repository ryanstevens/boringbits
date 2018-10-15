
import config from 'boring-config'
if (config.get('boring.babel_project') === true) {
  require('@babel/register');
}


import Server from './lib/server'
import Injecture from 'injecture'
import logger from 'boring-logger'

module.exports = {
  Server,
  Injecture,
  config,
  logger
} 