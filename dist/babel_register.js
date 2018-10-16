"use strict";

const config = require('boring-config');

require('@babel/register')({
  // ignore: [],
  "presets": [["@babel/preset-env", {
    "targets": {
      "node": config.get('boring.babel.node_target', '10.9.0')
    }
  }], '@babel/preset-react'],
  "plugins": ["@babel/plugin-proposal-object-rest-spread", ["@babel/plugin-proposal-decorators", {
    legacy: true
  }]]
});
//# sourceMappingURL=babel_register.js.map