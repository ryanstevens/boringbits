var config = require('boring-config');

require('@babel/register')({
  // ignore: [],
   "presets": [
     ["@babel/preset-env", {
       "targets": {
         "node": config.get('boring.babel.node_target', '8.10.0')
       }
     }],
     ["@babel/preset-typescript"],
     '@babel/preset-react'
   ],
   "extensions": [".jsx", ".js", ".tsx", ".ts"],
   "plugins": [
     "@babel/plugin-proposal-object-rest-spread",
     ["@babel/plugin-proposal-decorators", {
       legacy: true
     }],
     ["@babel/plugin-proposal-class-properties"],
   ]
 })