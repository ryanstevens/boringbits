var preset = require('@babel/preset-env')

module.exports = function(...args) {
  const api = args[0];
  const options = args[1] || {};
  const dirname = args[2]; 
  
  options.targets = {
    "node": "8"
  }
  return preset.default(api, options, dirname);
}