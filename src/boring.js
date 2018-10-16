
const config = require('boring-config');
if (config.get('boring.babel_project') === true) {
  require('@babel/register')({
   // ignore: [],
    "presets": [
      ["@babel/preset-env", {
        "targets": {
          "node": "10.9.0"
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
import logger from 'boring-logger'

module.exports = {
  Server,
  Injecture,
  config,
  logger
} 