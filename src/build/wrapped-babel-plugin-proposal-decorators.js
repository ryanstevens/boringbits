const plugin = require('@babel/plugin-proposal-decorators');

module.exports = function(...args) {
  const api = args[0];
  const options = args[1] || {};
  const dirname = args[2];

  options.legacy = true;
  return plugin.default(api, options, dirname);
};
