
const config = require('boring-config');
const logger = require('boring-logger')

if (config.get('boring.babel.register_app') === true) {
  logger.info('babelifying codebase via @babel/register')
  require('./babel_register');  
}

import Server from './lib/server'
import Injecture from 'injecture'

module.exports = {
  Server,
  Injecture,
  config,
  logger
} 