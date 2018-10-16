
const config = require('boring-config');
const logger = require('boring-logger')

if (config.get('boring.babel.register_app') === true) {
  logger.info('babelifying codebase via @babel/register')
  require('@babel/register')({
   // ignore: [],
    "presets": [
      ["@babel/preset-env", {
        "targets": {
          "node": config.get('boring.babel.node_target', '10.9.0')
        }
      }],
      '@babel/preset-react'
    ],
    "plugins": [
      "@babel/plugin-proposal-object-rest-spread",
      ["@babel/plugin-proposal-decorators", {
        legacy: true
      }]
    ]
  })

  
}

import Server from './lib/server'
import Injecture from 'injecture'

module.exports = {
  Server,
  Injecture,
  config,
  logger
} 